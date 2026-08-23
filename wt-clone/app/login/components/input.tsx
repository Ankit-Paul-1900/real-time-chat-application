import React from 'react';
interface InputProps{
    
    type:string
    placeholder:string
    value:string
    id:string
    name:string
    className?:string
    onChange:(e:React.ChangeEvent<HTMLInputElement>)=>void;
}
function Input({type,placeholder,id,name,className = "w-full p-2 m-2 border border-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded mx-0 gap-2",...props}:InputProps) {
  return (
    <div>
      <input 
      id={id}
      type={type}
      name={name}
      placeholder={placeholder}
      className={className}
      required
      {...props}     
      />
    </div>
  )
}

export default Input;
