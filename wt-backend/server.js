import express from "express";
import cors from "cors";
import dbConnect from "./database/mongo.js";
import router  from "./routes/users.js";
import messageRouter from "./routes/messages.js";
import cookieParser from 'cookie-parser';
import dotenv from "dotenv";
import {Server} from "socket.io";
import {initSocket} from "./utils/socket.js";
import http from 'http';
import httpServer from "http";
dotenv.config();

const app= express();
const server =http.createServer(app);
const port=process.env.PORT || 5000;
dbConnect();

//cloudinary config
 
export const io = new Server(httpServer, {
    cors: {
        origin: "http://localhost:3000",    
        credentials: true,
    }});
initSocket(server);

// const server=http.createServer(app);
app.use(express.json({limit:"4mb"}));
app.use(express.urlencoded({extended:true}));
    app.use(cors({ origin: "http://localhost:3000", credentials: true }));//{ origin: "http://localhost:5000", credentials: true }
app.use(cookieParser());
app.use("/uploads",express.static("uploads"));
app.use("/user",router);
app.use("/messages",messageRouter);
app.get("/",(req,res)=>{
    res.send("Welcome to Server Side!!")

})



if (process.env.NODE_ENV != "production"){

    server.listen(port,()=>{
        console.log("Server is running on port ",port)
    })
    
}


export default server;