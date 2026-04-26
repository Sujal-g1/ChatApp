
import express from "express"
import "dotenv/config";
import cors from "cors"; 
import http from "http"
import { connectDB } from "./config/db.js";
import userRouter from "./routes/userRoutes.js";
import friendRouter from "./routes/friendRoutes.js";
import messageRouter from "./routes/messageRoutes.js";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app)

// initialize socket.io server
export const io = new Server(server , {
    cors:{origin:"*"}
})

// store online users
//  {userId:socketId}
export const userSocketMap = {

}
 
//  socket.io connection handler
io.on("connection" , (socket)=>{
    const userId = socket.handshake.query.userId;
    console.log("User Connected" , userId);

    if(userId) userSocketMap[userId] = socket.id;

    // emit online users to all connected clients
    io.emit("getOnlineUsers" , Object.keys(userSocketMap));

    // video call starts --

    // Caller sends offer 
 socket.on("call-user", ({ to, offer, callerInfo }) => {
console.log(" CALL USER EVENT ")
console.log("Caller User ID:", userId);
console.log("Receiver User ID:", to);
console.log("Current userSocketMap:", userSocketMap);

const receiverSocketId = userSocketMap[to];

console.log("Receiver Socket ID:", receiverSocketId);

if (receiverSocketId) {
    console.log("Sending incoming-call event...");

    io.to(receiverSocketId).emit("incoming-call", {
        from: userId,
        offer,
        callerInfo
    });
} else {
    console.log("Receiver not found or offline");
}

});


    // Receiver sends answer 
    socket.on("answer-call", ({ to, answer }) => { 
        const callerSocketId = userSocketMap[to]; 
        if (callerSocketId) {
             io.to(callerSocketId).emit("call-answered", { answer
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


     // ICE candidate exchange 
     socket.on("ice-candidate", ({ to, candidate }) => {
         const targetSocketId = userSocketMap[to];
          if (targetSocketId) { 
            io.to(targetSocketId).emit("ice-candidate", { candidate });
         }
         }); 
     
     // End call 
     socket.on("end-call", ({ to }) => { 
        const targetSocketId = userSocketMap[to];
         if (targetSocketId) {
             io.to(targetSocketId).emit("call-ended"); 
            }
         });

       // video call  ends--


    socket.on("disconnect" , ()=>{
        console.log("User DisConnected" , userId);
        delete userSocketMap[userId];
        io.emit("getOnlineUsers" , Object.keys(userSocketMap))
    })

})


//middlewares 
app.use(express.json({limit:"4mb" }));
app.use(cors());


app.get("/", (req, res) => {
  res.send("Zinglee Backend is running 🚀");
});

app.use("/api/status" ,(req , res)=>res.send("Server is running"));
//routes setup
app.use("/api/auth" , userRouter);
app.use("/api/friends", friendRouter);
app.use("/api/messages" , messageRouter);


// connecting to db
await connectDB();

const PORT = process.env.PORT || 5002;
server.listen(PORT ,()=>console.log("Server is running on PORT:" + PORT))