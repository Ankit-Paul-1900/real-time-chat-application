"use client";
import React, { useEffect } from 'react'
import Image from 'next/image';
import { HiDotsVertical } from 'react-icons/hi';
import data from "@/app/data/data.json";
import {useState} from "react";
import {userData} from "../data/model";
import { useRouter } from 'next/navigation';
import { useAuthContext } from '../context/AuthContext';
import { useChatContext } from '../context/ChatContext';


function LeftSideBar( ) {
  const {getusers,users,selectedUser,setSelectedUser,unseenMessages,setUnseenMessages,getMessages}=useChatContext();
  const {onlineUsers,logout}=useAuthContext();
  const [input,setInput]=useState<string>("");

  const filteredUsers = input?users?.filter((us:any) => us.name.toLowerCase().includes(input.toLowerCase())):users;

  // const [users,setUsers]=useState<userData[]>();
  const [allUsers,setAllUsers]=useState<any[]|null>(null);
  
  const [displayOn,setDispalyOn]=useState<Boolean>(false);
  const router=  useRouter();

  useEffect(()=>{
    getusers();
  },[onlineUsers])


  useEffect(()=>{
 
    setAllUsers(users);
  },[users])
  const handleSelectUser=(us:any)=>{
      setUnseenMessages((prev:any)=>{

       const {[us._id]:_,...rest}=prev;
       return rest
      }
  )
  setSelectedUser(us);
  getMessages(us?._id);

  }
  const handleLogout=async()=>{
    const response = await logout();
    setDispalyOn(false);
    router.push('/login')
  }
  return (
    <div className={`flex flex-col flex-1  ${users ? 'min-w-[26%]' : 'min-w-[40%]'}  py-2 px-3`}>
      <div className='flex h-12.5 justify-between items-center relative'>
        <img src="/chat-side-icon.png" alt="no image found" className='h-full' />
        <HiDotsVertical className='text-amber-50  hover:cursor-pointer' onClick={()=>setDispalyOn(!displayOn)}/>
        <div className={`absolute top-9 right-2 flex flex-col bg-white text-gray-400 p-2 rounded-sm z-10 transform transition-all duration-300 ease-out ${displayOn ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto' : 'opacity-0 -translate-y-2 scale-95 pointer-events-none '} text-sm`}>
          <label htmlFor="" className='px-2 py-1 border-b font-semibold hover:cursor-pointer text-gray-400 hover:text-gray-600' onClick={()=>{
            router.push('/profile');
            setDispalyOn(false)
          }}>Profile</label>
          <label htmlFor="" className='px-2 py-1 font-semibold hover:cursor-pointer text-gray-400 hover:text-gray-600' onClick={handleLogout}>
            Sign Out
          </label>
        </div>
      </div>
      <input type="text" onChange={(e:any)=>setInput(e.target.value)} placeholder='Search..' className='border-2 border-violet-500 focus:outline-none bg-violet-900 rounded-2xl text-sm p-1 px-2 ' />
      <div className='h-full flex-1 backdrop-blur-lg backdrop-brightness-100 flex flex-col gap-3 rounded-3xl my-2 p-2  overflow-hidden'>
{
  filteredUsers?.map((us:any,index)=>{
    const isOnline=onlineUsers.includes(us._id);
    return (
      <div key={index.toString()} id={index.toString()} className="relative z-10 flex items-center gap-3 rounded-lg bg-white/10 backdrop-blur-sm p-3 cursor-pointer" onClick={() =>handleSelectUser(us)}>
          <Image
            src={us.profilePic?.url || "/image.png" }
            alt={us.name}
            width={40}
            height={40}
            className="h-10 w-10 rounded-full"
          />

          <div className="flex flex-col">
            <h3 className="font-semibold text-sm text-white text-clip overflow-hidden whitespace-nowrap">
              {us.name}</h3>

            <span className={`text-xs ${isOnline ? 'text-emerald-400' : 'text-gray-400'}`}>
              {isOnline ? 'Online' : 'Offline'}
            </span>
          </div>
          {unseenMessages[us._id] > 0 && (
            <span className="absolute top-2 right-2 bg-viloet-50/10 text-white text-xs font-semibold px-2 py-1 rounded-full">
              {unseenMessages[us._id]||6}
            </span>
          )}
          
        </div>
    )
    })
}
        
      </div>
    </div>
  )
}

export default LeftSideBar
