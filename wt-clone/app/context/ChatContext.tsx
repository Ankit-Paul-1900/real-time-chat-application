"use client";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import api from "@/lib/axios";
import { useAuthContext } from "./AuthContext";
import toast from "react-hot-toast";
interface ChatContextType {
            messages: any[],
            selectedUser: any | null,
            users: any[],
            unseenMessages: any,
            setMessages: (messages: any[]) => void,
            setUnseenMessages: (unseenMessages: any) => void,
            setSelectedUser: (user: any | null) => void,
            getusers: () => Promise<void>,
            getMessages: (userId: string) => Promise<void>,
            sendMessage: (messageData: any) => Promise<void>,

}
const ChatContext = createContext<ChatContextType | null>(null);
export const useChatContext = () => {
    const context = useContext(ChatContext);
    if (!context) {
        throw new Error("useChatContext must be used within a ChatProvider");
    }
    return context;
}

export default function ChatProvider({ children }: { children: ReactNode }) {

    const [messages,setMessages]=useState<any[]>([]);
    const [selectedUser, setSelectedUser]=useState<any|null>(null);
    const [users,setUsers]=useState<any[]>([]);
    const [unseenMessages,setUnseenMessages]=useState<any>({});
    const {socket}=useAuthContext();

    //function to fetch all users from the server
    const getusers=async()=>{
        try{
            const resp= await api.get("/messages/contacts-unseen-messages");
            if (resp.data) {
                setUsers(resp.data.users);
            
                setUnseenMessages(resp.data.unseenMessages);
            }
            else{
                if(resp.status!==401){

                    toast.error(resp.data.message);
                }
            }
        }
        catch(error:any){
               

            toast.error(`${error.message}`); 
        }
    }
//function to fetch all messages from the server for the selected user
    const getMessages= async(userId:string)=>{
        try{
            const {data}= await api.get(`/messages/read-messages/${userId}`);
            if (data.success) {
                setMessages(data.messages);
            }
            else{
                 if(data.status!==401){
                toast.error(data.message);}
            }
        }
        catch(error:any){
            toast.error(`{error.message}`);
        }
    }
    //function to send a message to the selected user
    const sendMessage=async(messageData:any)=>{
        try{
            const {data}= await api.post(`/messages/send-message/${selectedUser._id}`,messageData, {
          withCredentials:true
        });
            if (data.success) {
                setMessages((prevMessages)=>[...prevMessages,data.newMessage]);
                // toast.success("Image uploaded")
            }
            else{
                toast.error(data.message);
            }
        }
        catch(error:any){
            toast.error(`${error.message}`);
        }
    }
    //function to subscribe to socket events for real-time updates
    const subscribeToMessages=async()=>{
        if(!socket) return; 
        socket.on("newMessage",async(message:any)=>{
            if(message.senderId===selectedUser._id){
                
                message.seen=true
                setMessages((prevMessages)=>[...prevMessages,message]);
                await api.put(`/messages/mark-seen/${message._id}`);
            }
            else{
                 setUnseenMessages((prevUnseenMessages:any)=>({
                    ...prevUnseenMessages,
                    [message.senderId]: (prevUnseenMessages[message.senderId] || 0) + 1
            })
            )
            };
        })
    }

//function to unsubscribe from socket events when the component unmounts or the selected user changes
    const unsubscribeFromMessages = ()=>{
        if(!socket) return; 
        socket.off("newMessage");
    }

useEffect(()=>{
    subscribeToMessages();
    
    return ()=>{
        unsubscribeFromMessages();
    }
},[socket,selectedUser]);

    return (
        <ChatContext.Provider value={{
            messages,
            selectedUser,
            users,
            unseenMessages,
            setSelectedUser,
            setUnseenMessages,
            getusers,
            getMessages,
            sendMessage,
            setMessages,
            
         }}>
            {children}
        </ChatContext.Provider>)
}