
import express from "express"
import "dotenv/config";
import cors from "cors"; 
import http from "http"
import { connectDB } from "./config/db.js";
import userRouter from "./routes/userRoutes.js";

const app = express();
const server = http.createServer(app)


//middlewares
app.use(express.json({limit:"4mb" }));
app.use(cors());

app.use("/api/status" ,(req , res)=>{
    res.send("Server is running")
})

//routes setup
app.use("/api/auth" , userRouter);

// connecting to db
await connectDB();

const PORT = process.env.PORT || 5002;
server.listen(PORT ,()=>console.log("Server is running on PORT:" + PORT))