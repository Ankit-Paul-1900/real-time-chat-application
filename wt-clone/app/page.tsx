"use client"
import Image from "next/image";
import LeftSideBar from "./components/LeftSideBar";
import ChatSection from "./components/ChatSection";
import RightSideBar from "./components/RightSideBar";
import { useEffect, useState } from "react";
import {userData} from "./data/model";
import { Toaster } from "react-hot-toast";
import { useAuthContext } from "./context/AuthContext";
export default function Home() {
  
  const {onlineUsers,logout,users,fetchUsers}=useAuthContext();
  const [selecteduser,setSelecteduser]=useState<any | null>(null)
  const userhandler=(user:any | null)=>{
    setSelecteduser(user);
  }
  useEffect(()=>{
    fetchUsers();
  },[])
  return (
   <div className="flex justify-center items-center h-screen w-full px-[5%] py-[5%] sm:px-[15%] ">
    <Toaster/>
    <div className="backdrop-blur-lg  border-2 border-white rounded-2xl h-full w-full flex overflow-hidden ">
      <LeftSideBar/>
      <ChatSection/>
      <RightSideBar  logout={logout}/>
    </div>
   </div>
  );
}
