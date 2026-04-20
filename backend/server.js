
import express from "express"
import "dotenv/config";
import cors from "cors"; 
import http from "http"
import { connectDB } from "./config/db.js";
import userRouter from "./routes/userRoutes.js";
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
app.use("/api/messages" , messageRouter);


// connecting to db
await connectDB();

const PORT = process.env.PORT || 5002;
server.listen(PORT ,()=>console.log("Server is running on PORT:" + PORT))