import React, { use } from 'react'
import { Link } from 'react-router-dom'
import { useState } from 'react'

const UserLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const submitHandler = (e) => {
    e.preventDefault();
    console.log('Email:');
  }
  return (
    <div className='p-7 h-screen flex flex-col justify-between'> 
     <div> 
      <img  className='w-16 mb-10' src="https://logospng.org/download/uber/logo-uber-4096.png" alt="" />
      <form onSubmit={(e)=>submitHandler(e)}>
        
        <h3 className='text-lg font-medium mb-2'>what is your email</h3>
       
       
        <input required 
         value={email} onChange={(e)=>{
          setEmail(e.target.value);
         }}
        className='bg-[#eeeeee] mb-7 rounded px-4 py-2 border w-full text-lg placeholder:text-base' type="email" placeholder='email@example.com'/>
        
        
        
        <h3 className='text-lg font-medium mb-2'>Enter password</h3>


         <input required 
         value={password} onChange={(p)=>{
          setPassword(p.target.value);
         }}

         className='bg-[#eeeeee] mb-7 rounded px-4 py-2 border w-full text-lg placeholder:text-base' type="password" placeholder='password'/>
         
        <button 
        className='bg-[#111] text-white font-semibold mb-3 rounded px-4 py-2 w-full text-lg placeholder:text-base'>
          Login
        </button>

         <p className='text-center'> New here ? <Link to='/Signup' className='text-blue-600'>create new account </Link></p>

      </form>

      </div>
      <div>
        <button className='bg-[#111] text-white font-semibold mb-7 rounded px-4 py-2 w-full text-lg placeholder:text-base' > Sign in as captain </button>
        
      </div>
    </div>
  )
}

export default UserLogin
