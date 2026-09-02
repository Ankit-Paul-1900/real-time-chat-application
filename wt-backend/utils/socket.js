import {Server} from "socket.io";


const userSocketMap = {};
export let io;
export const initSocket = (httpServer) => {
     io = new Server(httpServer, {
    cors: {
      origin: process.env.NEXT_FRONTEND_URI,
      credentials: true,
    },
  });
    console.log("Initializing socket.io server...");

    io.on("connection",(socket)=>{
    //connected user id from the query parameter
    const userId=socket.handshake.query.userId;
    console.log("Socket connected:", socket.id, "UserId:", userId);
    if(userId){
        userSocketMap[userId]=socket.id;
        console.log("User connected:", userId,"======> socketid",socket.id);
    }

    io.emit("getOnlineUsers",Object.keys(userSocketMap));
    socket.on("disconnect",()=>{ 
        delete userSocketMap[userId];
        io.emit("getOnlineUsers",Object.keys(userSocketMap));
    })
    });
    return io;
}
export {userSocketMap};