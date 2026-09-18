'use client';
import React from 'react';
import Input from './input';
import Link from 'next/link';
import { useState } from 'react';
import axios from 'axios';
import api from '@/lib/axios';

const regDATA= {name:"",email:"",password:"",agreeToTerms:false}
interface RegProps{
    name:string
    email: string
    password:string
    agreeToTerms:boolean

}
interface stateProps{
    state:boolean
    stateFunction:(val:boolean)=>(void)
}
const Register = ({state,stateFunction}:stateProps) => {
    const [loading,setLoading]=useState<boolean>(false);
    const [regData,setRegData]=useState<RegProps>(regDATA)
     const inputhandler=(e:React.ChangeEvent<HTMLInputElement>)=>{
        setRegData((prev)=>({...prev,[e.target.name]:e.target.value}));
    }
    const statehandler=()=>{
        stateFunction(!state)
    }
    const registerHandler=async(e:React.ChangeEvent<HTMLInputElement>,payload:RegProps)=>{
        e.preventDefault();
        setLoading(true);
        const response=await api.post("/user/register",payload).then((res)=>{
            stateFunction(!state)
        }).catch((err)=>{
            console.log(err)
        }).finally(()=>{
            setLoading(false);
            setRegData(regDATA)
        } )
    }

    const isRegisterDisabled =
  loading ||
  !regData?.name ||
  !regData?.email ||
  !regData?.password ||
  !regData?.agreeToTerms;
  return (
    <div className='flex flex-col gap-2  w-80 p-3 border border-gray-500 rounded-md'>
      <h1 className='text-lg font-bold text-white'>Sign Up</h1>
      <form className='' onSubmit={(e:any)=>registerHandler(e,regData)}>
          <Input id="name" name="name" type="text" value={regData.name} placeholder="Full Name"  onChange={(e:any)=>inputhandler(e)}/>
          <Input id="email" name="email" type="email" value={regData.email} placeholder="Email Address" onChange={(e:any)=>inputhandler(e)}/>
          <Input id="password" name="password" type="password" value={regData.password} placeholder="Password" onChange={(e:any)=>inputhandler(e)}/>
          <p className=''>
          <input id="checkbox-1" type="checkbox" value="" name="" onChange={(e)=>setRegData((prev)=>({...prev, agreeToTerms: !!e.target.value}))} className='my-2'/>
          <span className='text-xs text-white'> *Agree to the terms of use & privacy policy.</span>
          </p>
          <button
            className={` my-2 py-3 w-full bg-linear-to-r from-purple-400 to-violet-600 text-white rounded cursor-pointer
                ${
                isRegisterDisabled
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:opacity-90"
                }`}
            disabled={isRegisterDisabled}
            >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
      </form>
          
          <p className='text-sm font-bold text-white my-2'>Already have an account? <span className='text-purple-600 text-bold cursor-pointer' onClick={statehandler}>Log In</span></p>
    </div>
  )
}

//  <div className='flex flex-col items-center justify-center w-80 bg-amber-500 p-4'>
//       <h1 className='text-lg font-bold text-white'>Sign Up</h1>
//       <form className='flex flex-col'>
//           <Input id="name" name="name" type="name" value="name" placeholder="Full Name" onChange={(e)=>{}}/>
//           <Input id="email" name="email" type="email" value="email" placeholder="Full Email" onChange={(e)=>{}}/>
//           <Input id="password" name="password" type="password" value="password" placeholder="Full Password" onChange={(e)=>{}}/>
//           <button className='block bg-blue-700'>Submit</button>
//       </form>
//     </div>

export default Register;