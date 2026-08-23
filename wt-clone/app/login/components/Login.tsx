"use client";
import React, { useState } from 'react'
import { useRouter } from 'next/navigation';
import Input from './input';
import axios from 'axios';
import { useAuthContext } from '@/app/context/AuthContext';
import toast from 'react-hot-toast';
import api from '@/lib/axios';
interface  Data{
    email:string
    password:string
}
interface stateProps{
    state:boolean
    stateFunction:(val:boolean)=>(void)
}
function Login({state,stateFunction}:stateProps) {
    const {checkAuth}=useAuthContext();
    const router = useRouter();
    const [loading,setLoading]=useState<boolean>(false);
    const [userdata,setUserdata]=useState<Data>({email:"",
    password:""
    });
    const [checkClicked,setCheckClicked]=useState<boolean>(false);
    const inputhandler=(e:any)=>{
        setUserdata((prev)=>({...prev,[e.target.name]:e.target.value}))
    }
    const statehandler=()=>{
        stateFunction(!state)
    }
    let isLoginEnable:boolean=!!userdata.email && !!userdata.password && checkClicked;

     const loginHandler=async(e:React.ChangeEvent<HTMLInputElement>,payload:Data)=>{
            e.preventDefault();
            
             setLoading(true);
        await api.post("/user/login",
            userdata, 
            {
            withCredentials: true,
            }
        ).then(async (res)=>{
            const user=await checkAuth();
            router.push('/')

            }).catch((err)=>{
                console.log(err)
            }).finally(()=>{
                stateFunction(!state)
                setLoading(false);

                setUserdata({email:"",password:""})
            } )}


            
  return (
    <div className='border border-gray-500 backdrop-blur-lg rounded-md flex flex-col max-w-80 p-4 '>
        <h1 className='text-3xl font-bold'>Login</h1>
       <form onSubmit={(e:any)=>loginHandler(e,userdata)} method='POST'>
        <Input id="email" name="email" type="text" placeholder="Username" value={userdata.email} 
        onChange={(e)=>{inputhandler(e)} } 
        className='my-4 border-2 border-gray-400 relative min-w-full py-2 px-1 rounded-sm focus:outline-none focus:ring-2 focus:ring-indigo-600'/>
         <Input id="email" name="password" type="password" placeholder="Password" value={userdata.password} 
        onChange={(e)=>{inputhandler(e)}}
        className='my-4 border-2 border-gray-400 relative min-w-full py-2 px-1 rounded-sm  focus:outline-none focus:ring-2 focus:ring-indigo-600'/>
       
       
       <button className={`w-full bg-linear-to-r ${loading || !isLoginEnable ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'} from-purple-600 to-violet-600 p-2 rounded-sm text-white text-xl disabled:cursor-not-allowed cursor-pointer`} disabled={!isLoginEnable || loading} >
             {loading ? "Logging in..." : "Login"}
       </button>
       
       
       <div className='my-3 text-gray-500'>
        <input type="checkbox" name="" id="" onChange={(e)=>setCheckClicked(!!e.target.value)} /><span className='text-sm ml-2'>
           *Agree to the terms of use & privacy policy.
        </span>

        <p className='my-3 text-gray-500'>
           Don't have an account? <b className='text-purple-600 text-bold cursor-pointer' onClick={statehandler}> Click here</b>
        </p>
       </div>
       </form>
    </div>
  )
}

export default Login;
