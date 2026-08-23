"use client";
import React, { useEffect, useRef, useState } from 'react';
import {userData} from "@/app/data/model";
import data from "@/app/data/data.json";
import{Info,Send,Image,X} from "lucide-react";
import { useChatContext } from '../context/ChatContext';
import { useAuthContext } from '../context/AuthContext';
import { toast } from 'react-hot-toast/headless';

interface MessageData{
  content:string,
  image: File | null,
  imagePreviewUrl: string | null;
}

function ChatSection() {
  const {messages, selectedUser,setSelectedUser,getMessages,sendMessage,getusers}=useChatContext();

  const {currentuser,onlineUsers}=useAuthContext();
  const [input,setInput]=useState<MessageData>({
    content:"",
    image: null as File | null,
    imagePreviewUrl: null as string | null
  });

  const [imageUrl,setImageUrl]=useState<File | null>(null);
  const scrollEnd=useRef<HTMLDivElement>(null);

  const handleSendMessage=async(e: React.MouseEvent<HTMLButtonElement>)=>{
    e.preventDefault();
    e.stopPropagation();
    // if (!input.content.trim()){
    //   toast.error("Input not given!! ")
    //   return;

    // } 
    const formData= new FormData();
    formData.append("content", input.content.trim())
     formData.append(  "receiverId", selectedUser?._id)
      formData.append( "senderId", currentuser?._id)
    
      if (input.image){
        formData.append("image",input.image)
      }
   for (const [key, value] of formData.entries()) {
}
    await sendMessage(formData);
    console.log("Message send successfully!!")
    setInput((prev)=>({...prev,content:"",image:null,imagePreviewUrl:null}));
  }




  const handleSendImage=async(e: React.ChangeEvent<HTMLInputElement>)=>{
    const file = e.target.files?.[0];
  

    if (!file || !file.type.startsWith('image/')){
      toast.error("Please select a valid image file");
      return;

    } 
    const profilepic=file;
     const previewUrl = URL.createObjectURL(file);
    setImageUrl(
    profilepic
    );
    setInput((prev:any)=>({...prev,image:profilepic,imagePreviewUrl:previewUrl}))
    //  sendMessage({image:file,receiverId:selectedUser?._id,senderId:currentuser?._id,timestamp:new Date().toISOString()});
  }

  useEffect(()=>{
    if(scrollEnd.current){
      scrollEnd.current.scrollIntoView({behavior:"smooth"});
    }
  })
  useEffect(()=>{
    
    getusers();

   
  },[selectedUser])

  
  return (
    <div className={`relative flex flex-2 ${selectedUser ? 'min-w-[50%]' : 'min-w-[75%]'} justify-center items-center`}>
      {
        selectedUser? (
        <div className='relative h-full w-full flex  bg-white/5 backdrop-blur-lg '>
          <div className="flex flex-col gap-1 w-full p-2">
          <div className="header flex relative border-b-2 max-h-10 p-2 w-full">
            <img src={selectedUser.profilePic?.url || "/image.png"} alt={selectedUser.name} className=' rounded-full' />
            <h1 className='text-md w-full flex-1   ml-2 text-white'>{selectedUser.name}</h1>
            <Info />
          </div>
          <div className="flex flex-col flex-1 w-full border border-white/10 rounded-2xl p-3 overflow-y-scroll">
              {
                messages.map((message: any,index: number) => (
                  <div key={index} className={`flex mb-2 justify-between     
                   rounded-bl-md rounded-tl-sm  rounded-tr-md p-2 ${message.senderId !== currentuser?._id?'flex-row' : 'flex-row-reverse'}`}>

                          {message.image.url?(
                            <img src={message.image.url} alt="message image" className='max-w-57.5 border border-gray-700 rounded lg overflow-hidden mb-8' />
                          ):(
                            <p className={`text-sm text-white p-2 max-w-[200px] break-all bg-violet-500/30 ${message.senderId !== currentuser?._id ? 'rounded-bl-none' : 'rounded-br-none'} rounded-lg`}>{message.content}</p>
                          )
                          }
                    
                  </div>
                ))
              }
          </div>
          <div className="foo min-h-[30px] flex border-0 rounded-2xl gap-2 items-center px-1">
            <div className="border-2 border-white/10 rounded-2xl h-full flex-1 flex items-center px-2 ">
            
            <input type="text" placeholder='Type a message..' className='border-0 focus:outline-none bg-transparent w-full h-full p-1 px-2 text-sm text-white' onChange={(e) => setInput((prev)=>({...prev,content:e.target.value}))} value={input.content} onKeyDown={(e:any) => e.key === 'Enter' ?handleSendMessage(e):null} />
            
            <label
  htmlFor={input.image ? undefined : "filetab"}
  className="relative cursor-pointer flex items-center gap-5"
>
  <Image
    className={`${input.image ? "text-green-600" : "text-white"}`}
  />

  {input.image && (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();

        setInput((prev:any) => ({
          ...prev,
          image: "",
        }));

        // Clear the file input
        const fileInput = document.getElementById(
          "filetab"
        ) as HTMLInputElement;

        if (fileInput) {
          fileInput.value = "";
        }
      }}
      className="absolute -top-2 -right-2 rounded-full bg-black/40 hover:bg-black/60 p-0.5"
    >
      <X className="h-3 w-3 text-white/70" />
    </button>
  )}

  <input
    id="filetab"
    type="file"
    name="profilepic"
    accept="image/*"
    hidden
    onChange={(e) => handleSendImage(e)}
  />
</label>
           
            </div>
            <button
            type="button"
           disabled={input.image || input.content ? false :true}
              onClick={(e:any) => handleSendMessage(e)}
            className="disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            <Send  className="h-3/4"  />
          </button>
          </div>
          </div>
        </div>
      )
     
      :
      ( <div className='absolute h-full w-full flex justify-center items-center bg-white/10 backdrop-blur-lg '>

        <div className='text-center z-10'>
          <h1>CHATVERSE</h1>
          <h6 className='text-xs'>Chat anytime.Chat anywhere</h6>
        </div>
      </div>)
     
}
    </div>
  )
}

export default ChatSection
