import React from 'react'

const UserSignup = () => {
   const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
  
    const [userData ,setuserData] = useState({});
  
    const submitHandler = (e) => {
      e.preventDefault();
     setuserData({
      email: email,
       password: password
     })
     console.log(userData);
      // Reset the form fields after submission
     setEmail('');
      setPassword('');
    }
  return (
   <div className='p-7 h-screen flex flex-col justify-between'> 
     <div> 
      <img  className='w-16 mb-10' src="https://logospng.org/download/uber/logo-uber-4096.png" alt="" />
      <form onSubmit={(e)=>submitHandler(e)}>

         <h3 className='text-lg font-medium mb-2'>what is your name </h3>
         <div className='flex gap-4 mb-5 '>
          
        <input required 
        
        className='bg-[#eeeeee] w-1/2  rounded px-4 py-2 border text-lg placeholder:text-base' type="text" placeholder='Frist name'/>
        
        
        <input required 
        
        className='bg-[#eeeeee]  w-1/2 rounded px-4 py-2 border  text-lg placeholder:text-base' type="text" placeholder='last name '/>
        
        
        
         </div>
        
        <h3 className='text-lg font-medium mb-2'>what is your email</h3>
       
       
        <input required 
        
        className='bg-[#eeeeee] mb-5 rounded px-4 py-2 border w-full text-lg placeholder:text-base' type="email" placeholder='email@example.com'/>
        
        
        
        <h3 className='text-lg font-medium mb-2'>Enter password</h3>


         <input required 
        

         className='bg-[#eeeeee] mb-5 rounded px-4 py-2 border w-full text-lg placeholder:text-base' type="password" placeholder='password'/>
         
        <button 
        className='bg-[#111] text-white font-semibold mb-3 rounded px-4 py-2 w-full text-lg placeholder:text-base'>
          Login
        </button>

         <p className='text-center'> New here ? <Link to='/Signup' className='text-blue-600'>create new account </Link></p>

      </form>

      </div>
      <div>
        <Link to='/capatain-login' className=' flex items-center justify-center bg-[#111] text-white font-semibold mb-5 rounded px-4 py-2 w-full text-lg placeholder:text-base' > Sign in as captain </Link>
        
      </div>
    </div>
  )
}

export default UserSignup
