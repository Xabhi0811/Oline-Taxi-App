import React from 'react';
import  { useState } from 'react';
import { Link , useNavigate} from 'react-router-dom';
import  axios from 'axios';


const UserSignup = () => {
   const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [userData ,setUserData] = useState({});

    const useNavigate= useNavigate();
  
    
  
    const submitHandler = (e) => {
      e.preventDefault();
      const newUser ={
        fullName:{
          firstName: firstName,
          lastName: lastName
        },
        email: email,
        password: password
      }
      
    
     
      // Reset the form fields after submission
     setEmail('');
      setPassword('');
      setFirstName('');
      setLastName('');

    }
  return (
   <div className='p-7 h-screen flex flex-col justify-between'> 
     <div> 
      <img  className='w-16 mb-10' src="https://logospng.org/download/uber/logo-uber-4096.png" alt="" />
      <form onSubmit={(e)=>submitHandler(e)}>

         <h3 className='text-base font-medium mb-2'>what is your name </h3>
         <div className='flex gap-4 mb-6 '>
          
        <input required 
        
        className='bg-[#eeeeee] w-1/2  rounded px-4 py-2 border text-base placeholder:text-sm' type="text" placeholder='Frist name'
        value={firstName} onChange={(e)=>{
          setFirstName(e.target.value)
        }}/>
        
        <input required 
        
        className='bg-[#eeeeee]  w-1/2 rounded px-4 py-2 border  text-base placeholder:text-sm' type="text" placeholder='last name '
         value={lastName} onChange={(e)=>{ 
          setLastName(e.target.value)
        }}/>
        
        
        
         </div>
        
        <h3 className='text-base font-medium mb-2'>what is your email</h3>
       
       
        <input required 
    value={email} onChange={(e)=>{
      setEmail(e.target.value)
    }}
        
        className='bg-[#eeeeee] mb-6 rounded px-4 py-2 border w-full text-base placeholder:text-sm' type="email" placeholder='email@example.com'/>
        
        
        
        <h3 className='text-base font-medium mb-2'>Enter password</h3>


         <input required 
         value={password} onChange={(p)=>{
          setPassword(p.target.value)
         }}

         className='bg-[#eeeeee] mb-6 rounded px-4 py-2 border w-full text-base placeholder:text-sm' type="password" placeholder='password'/>
         
        <button 
        className='bg-[#111] text-white font-semibold mb-3 rounded px-4 py-2 w-full text-lg placeholder:text-base'>
          Login
        </button>

         <p className='text-center'> Already have a account ? <Link to='/login' className='text-blue-600'>Login here </Link></p>

      </form>

      </div>
      <div>
        <p className='text-[12px] leading-tight '> By proceesing, you  consent to get calls, WhatApp or SMS 
          messages, including by automated dialer, from Uber and 
          its affiliates to the number you provided.
        </p>
        
      </div>
    </div>
  )
}

export default UserSignup
 