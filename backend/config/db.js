

import mongoose from "mongoose"

export const connectDB = async() =>{
    try{
    mongoose.connection.on('connected' , ()=>console.log('Database connected'))
    await mongoose.connect(`${process.env.MONGO_URI}/chat-app`)
    }
    catch(error){
        console.error(error);
    }
}

// import mongoose from "mongoose";

// export const connectDB = async () => {
//   try {
    
//     const conn = await mongoose.connect(process.env.MONGO_URI);
//     console.log(`MongoDB Connected: ${conn.connection.host}`);
//   } catch (error) {
//     console.error("MongoDB connection error:", error.message);
//     process.exit(1);
//   }
// };

