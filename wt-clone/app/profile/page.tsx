"use client";
import axios from 'axios';
import React, { useState,useEffect } from 'react';
import { useAuthContext } from '../context/AuthContext';
import api from '@/lib/axios';
import { useRouter } from 'next/navigation';
interface EditProps{
  name:string,
  bio:string,
  profilepic:string | File | null
  imagePreviewUrl:string | null
}
function page() {
   const {currentuser,checkAuth,setCurrentuser}=useAuthContext();
  const [editData, setEditData]=useState<EditProps>({
    name:currentuser?.name || "",
    bio:currentuser?.bio || "",
    profilepic: null as File | null,
    imagePreviewUrl: null as string | null});
   const [loading,setLoading]=useState<boolean>(false);
   const router= useRouter();
  useEffect(() => {
  if (currentuser) {
    setEditData({
      name: currentuser?.name || "",
      bio: currentuser?.bio || "",
      profilepic: currentuser?.profilePic?.url || "",
      imagePreviewUrl: currentuser?.profilePic?.url || null,
    });
  }
}, [currentuser]);

  const editOnChange=(e:any)=>{
    const { name, value, files, type } = e.target;
   if (type === "file") {
    const file=files?.[0] || null;
     const previewUrl = URL.createObjectURL(file);
    setEditData(prev => ({
      ...prev,
      profilepic:file,
      imagePreviewUrl: previewUrl,
    }));
  } else {
    setEditData(prev => ({
      ...prev,
      [name]: value,
    }));
  }
};

  const edithandler=async()=>{

  const formData = new FormData();

  formData.append("name", editData.name);
  formData.append("bio", editData.bio);

  if (editData.profilepic) {
    formData.append("profilepic", editData.profilepic);
  }

      setLoading(true);
      const response = await api.patch("/user/edit",
        formData,
        {
          withCredentials:true
        }
      ).then((res)=>{
        setCurrentuser(res.data.data);
        setLoading(false);
      }).catch((err)=>{
        console.log(err.message)
        setLoading(false);
        throw err;
      }

      ).finally(()=>{
        router.push("/")
      })
        
      
  }

  return (
    <div className='h-screen w-screen flex items-center justify-center'>
      <div className="container h-[90%] md:w-[50%] md:h-[60%]  rounded-xl border-b-gray-300 border-2 p-7 flex sm:flex-col-reverse md:flex-row backdrop-blur-lg">
        <div className="left flex flex-col flex-1 gap-3 p-2">

          <p className="text-md text-left font-bold  text-gray-400">Profile Details</p>
          <div className="profile flex items-center gap-5 mt-5">
            <label htmlFor="filetab" className='cursor-pointer flex items-center gap-5'>
              <img src={`${editData.imagePreviewUrl}` || `./image.png`} alt="./blank_image.webp" className='h-10 w-10 rounded-full  border-amber-100 border-2 text-center' />
          <input id="filetab" type="file" name="profilepic" placeholder="Choose your profile photo" hidden onChange={editOnChange}/> 
          Choose your profile photo
              </label>
        </div>
          <input type="text" name="name" id="name" placeholder="Enter your name" className='border-2 border-gray-300 rounded-md p-2 my-2 focus:outline-0 focus:ring-indigo-400' value={editData.name} onChange={editOnChange} />
          <textarea name="bio" id="bio" rows={7} placeholder="Enter your bio" className='border-2 border-gray-300 rounded-md p-2 my-2 focus:outline-0 focus:ring-indigo-400' value={editData.bio} onChange={editOnChange} />
          <button className='rounded-xl my-2 p-1 bg-amber-100  bg-linear-to-r from-purple-500 to-indigo-700 ' onClick={()=>{
            edithandler()
          }}>{
            loading?"Updating...":"Save Changes"
          }</button>
          </div>
        <div className="profile flex items-center gap-5 mt-5 min-w-[30%] p-5 justify-around">
          <img src={`${editData.imagePreviewUrl}` || `./image.png`} alt="./blank_image.webp" className='h-50 w-50 rounded-full border-amber-100 border-2 text-center' />

        </div>
      </div>
      
    </div>
  )
}

export default page
