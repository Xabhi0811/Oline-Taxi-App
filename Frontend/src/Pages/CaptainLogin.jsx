
import { Link } from 'react-router-dom'
import { useState } from 'react'


const CaptainLogin = () => {
   const [email, setEmail] = useState('');
      const [password, setPassword] = useState('');
    
      const [captainData ,setcaptainData] = useState({});
    
      const submitHandler = (e) => {
        e.preventDefault();
       setcaptainData({
        email: email,
         password: password
       })
      
        // Reset the form fields after submission
       setEmail('');
        setPassword('');
      }
  return (
    
       <div className='p-7 h-screen flex flex-col justify-between'> 
           <div> 
            <img  className='w-20 mb-3' src="https://static.vecteezy.com/system/resources/previews/027/127/451/non_2x/uber-logo-uber-icon-transparent-free-png.png" alt="" />
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
      
               <p className='text-center'> Join a fleet ? <Link to='/capatain-Signup' className='text-blue-600'>Register as a captain </Link></p>
      
            </form>
      
            </div>
            <div>
              <Link to='/login' className=' flex items-center justify-center bg-[#d5622d] text-white font-semibold mb-5 rounded px-4 py-2 w-full text-lg placeholder:text-base' > Sign in as user </Link>
              
            </div>
          </div>
  
  )
}

export default CaptainLogin
