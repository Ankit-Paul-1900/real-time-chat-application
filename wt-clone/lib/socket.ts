import {io,Socket} from "socket.io-client";
let socket:Socket|null =null;

export const connectSocket=(user:Object)=>{
    if(!socket){
        socket=io(process.env.PUBLIC_BASEURL!,{
            auth:user,
            transports:["websocket"]
        })
    }
    return socket;
};

export const disconnectSocket=()=>{
    if (socket){
         socket.disconnect();
         socket=null;
    }
}

export const getSocket=()=>socket;
