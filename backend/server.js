import express from "express";
import "dotenv/config";
import cors from "cors";
import http from "http";

import { connectDB } from "./config/db.js";
import userRouter from "./routes/userRoutes.js";
import friendRouter from "./routes/friendRoutes.js";
import messageRouter from "./routes/messageRoutes.js";
import communityRouter from "./community/routes/communityRoutes.js";
import joinRequestRouter from "./community/routes/joinRequestRoutes.js";
import communityMemberRouter from "./community/routes/communityMemberRoutes.js";
import communityMessageRouter from "./community/routes/communityMessageRoutes.js";
import feedbackRoutes from "./routes/feedbackRoutes.js";

import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);

// Initialize Socket.IO server
export const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// Store online users { userId: socketId }
export const userSocketMap = {};

export const emitToUser = (userId, event, data) => {
  const id = userId?.toString();
  const socketId = userSocketMap[id];

  if (socketId) {
    io.to(socketId).emit(event, data);
  }
};

// Socket.IO connection handler
io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;

  // console.log("User Connected:", userId);

  if (userId) {
    userSocketMap[userId] = socket.id;
    socket.join(userId.toString());
  }

  // Emit online users
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  // ===========================
  // Typing Indicators
  // ===========================

  socket.on("typing", ({ to }) => {
    const receiverSocketId = userSocketMap[to];

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("userTyping", {
        from: userId,
      });
    }
  });

  socket.on("stopTyping", ({ to }) => {
    const receiverSocketId = userSocketMap[to];

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("userStopTyping", {
        from: userId,
      });
    }
  });

  // ===========================
  // Video Call
  // ===========================

  // Caller sends offer
  socket.on("call-user", ({ to, offer, callerInfo }) => {
    const receiverSocketId = userSocketMap[to];

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("incoming-call", {
        from: userId,
        offer,
        callerInfo,
      });
    } else {
      console.error("Receiver not found");
    }
  });

  // Receiver sends answer
  socket.on("answer-call", ({ to, answer }) => {
    const callerSocketId = userSocketMap[to];

    if (callerSocketId) {
      io.to(callerSocketId).emit("call-answered", {
        answer,
      });
    }
  });

  // Reject call
  socket.on("reject-call", ({ to }) => {
    const callerSocketId = userSocketMap[to];

    if (callerSocketId) {
      io.to(callerSocketId).emit("call-rejected");
    }
  });

  // ICE Candidate exchange
  socket.on("ice-candidate", ({ to, candidate }) => {
    const targetSocketId = userSocketMap[to];

    if (targetSocketId) {
      io.to(targetSocketId).emit("ice-candidate", {
        candidate,
      });
    }
  });

  // End call
  socket.on("end-call", ({ to }) => {
    const targetSocketId = userSocketMap[to];

    if (targetSocketId) {
      io.to(targetSocketId).emit("call-ended");
    }
  });

  // ===========================
// Community Chat
// ===========================

socket.on("community:join", async ({ communityId }) => {
  try {
    if (!communityId || !userId) {
      return;
    }

    const CommunityMember =
      (await import("./community/models/CommunityMember.js"))
        .default;

    const member =
      await CommunityMember.findOne({
        communityId,
        userId,
        status: "active",
      });

    if (!member) {
      socket.emit("community:error", {
        message:
          "You are not an active member of this community.",
      });

      return;
    }

    const room = `community:${communityId}`;

    socket.join(room);

    console.log(
      `User ${userId} joined community room: ${room}`
    );

    socket.emit("community:joined", {
      communityId,
    });
  } catch (error) {
    console.error(
      "Community join error:",
      error.message
    );

    socket.emit("community:error", {
      message: "Failed to join community.",
    });
  }
});

socket.on(
  "community:leave",
  ({ communityId }) => {
    if (!communityId) {
      return;
    }

    const room = `community:${communityId}`;

    socket.leave(room);

    console.log(
      `User ${userId} left community room: ${room}`
    );
  }
);


  socket.on("disconnect", () => {
    console.log("User Disconnected:", userId);

    delete userSocketMap[userId];

    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

// ===========================
// Middlewares
// ===========================

app.use(express.json({ limit: "4mb" }));
app.use(cors());

// ===========================
// Health Check
// ===========================

app.get("/", (req, res) => {
  res.send("Zingleee Backend is running 🚀");
});

app.use("/api/status", (req, res) => res.send("Server is running"));

// ===========================
// Routes
// ===========================

app.use("/api/auth", userRouter);
app.use("/api/friends", friendRouter);
app.use("/api/messages", messageRouter);
app.use( "/api/community", communityMessageRouter );
app.use("/api/community", communityRouter);
app.use("/api/community", joinRequestRouter);
app.use( "/api/community", communityMemberRouter );
app.use("/api/feedback", feedbackRoutes);


// ===========================
// Connect DB & Start Server
// ===========================

await connectDB();

const PORT = process.env.PORT || 5004;

server.listen(PORT, () => {
  console.log(`Server is running on PORT: ${PORT}`);
});