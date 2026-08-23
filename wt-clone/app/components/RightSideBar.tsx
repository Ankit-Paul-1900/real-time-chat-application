import React from 'react';
import {userData} from "@/app/data/model";
import { useAuthContext } from '../context/AuthContext';
import {useRouter} from "next/navigation";
import { useChatContext } from '../context/ChatContext';
interface userProps{
  logout:()=>Promise<void>
}
const RightSideBar = ({logout}:userProps) => {
    const {selectedUser,setSelectedUser,messages}=useChatContext();
    const {onlineUsers}=useAuthContext();
  
  const  [loading,setLoading]=React.useState<boolean>(false);
  const router=useRouter();
  const logoutHandler=async()=>{
    setLoading(true);
    const response = await logout();
    setLoading(false);
    router.push('/login')
  }
   const isOnline=onlineUsers.includes(selectedUser?._id);
  return (
    <div className={`relative flex flex-2 ${selectedUser ? 'min-w-[25%]' :'w-0'}   h-full`}>

    <div className='flex flex-1 min-w-[50%] flex-col pt-[10%] items-center gap-1'>
      <div className="header min-h-[20%] w-full flex flex-col items-center justify-center gap-2">
        <img src={selectedUser?.profilePic?.url || "/image.png"} alt={selectedUser?.name} className='h-10 w-10 rounded-full' />
        <h1>{selectedUser?.name}</h1>
       
        <span className={`text-xs ${isOnline ? 'text-emerald-400' : 'text-gray-400'}`}>
              {isOnline ? 'Online' : ' Offline'} </span>
      </div>
      <hr className="w-[90%] align-middle h-2"/>
      <div className="middle flex-1 w-full flex flex-col">
        <p className="text-sm text-left px-2 mb-2">Media</p>
        <div className='flex-1 flex flex-wrap content-start gap-x-2 gap-y-4 justify-evenly'>

        {messages && (
                         messages?.map((msg,index)=>{
                          return (
                               msg?.image.url && <img key={index} src={msg?.image?.url} alt="message image"  className="w-24 h-24 object-cover border border-gray-700 rounded-lg"/>
                          )
                         })  
                          )
                        }
        </div>

      </div>
      <div className="footer flex w-full min-h-50px justify-center">
        <button className="rounded-xl my-2 p-1 bg-amber-100 w-[95%] bg-linear-to-r from-purple-500 to-indigo-700 cursor-pointer" onClick={logoutHandler} disabled={loading}>
          {loading ? 'Logging out...' : 'Logout'}
        </button>
      </div>
    </div>
    </div>
  )
}

export default RightSideBar
