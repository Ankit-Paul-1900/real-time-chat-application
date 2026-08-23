'use client';
import React, { useState } from 'react';
import Login from './components/Login';
import Register from './components/Register';

function page() {
  const [toggle,setToggle]=useState<boolean>(true);
  const togglehandler=(val:boolean)=>{
    setToggle(val)
  }
  return ( 

      <div className="flex min-h-screen p-8 backdrop-blur  max-sm:flex-col justify-center items-center bg-center">
          <div className=' flex   items-center justify-end    '>
            <img src="/chat-icon.png" alt="" className='w-[min(50vw,500px)]'    />
            
          </div>
          <div id='InputBox' className=' flex items-center justify-center '>
            {
              toggle?
              (<>
              <Login state={toggle} stateFunction={(val:boolean)=>togglehandler(val)}/>  
              
              </>):
              (
                <Register state={toggle} stateFunction={(val:boolean)=>togglehandler(val)}/>

              )
            }
          </div>
      </div>
  )
}

export default page
