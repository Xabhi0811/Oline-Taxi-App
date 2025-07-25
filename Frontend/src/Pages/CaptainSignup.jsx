
import { Link } from 'react-router-dom'
import React, { use, useState } from 'react'
import { CaptainDataContext } from '../context/CaptainContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CaptainSignup = () => {

 const navigate = useNavigate();


  const [email, setEmail] = useState('');
     const [password, setPassword] = useState('');
     const [firstName, setFirstName] = useState('');
     const [lastName, setLastName] = useState('');
     const [userData ,setUserData] = useState({});


     const [vehicleType, setVehicleType] = useState('');
     const [vehiclePlate, setVehiclePlate] = useState('');
      const [vehicleColor, setVehicleColor] = useState('');
      const [ vehicleCapacity, setVehicleCapacity] = useState('');
   
     

     const { captain , setCaptain } = React.useContext(CaptainDataContext);
   
     const submitHandler = async (e) => {
       e.preventDefault();
       const captainData = {
       fullname:{
        firstname: firstName,
         lastname: lastName
       },
       email: email,
        password: password,
        vehicle: {
          vehicleType: vehicleType,
          plate: vehiclePlate,
          color: vehicleColor,
          capacity: vehicleCapacity
        }
 
      }
       
  const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/captains/register`, captainData);

     
      if(response.status === 201){
        const data = response.data 
        setCaptain(data.captain);
        localStorage.setItem('captainToken', data.token);
        navigate('/captain-home');
      }
       // Reset the form fields after submission
      setEmail('');
       setPassword('');
       setFirstName('');
       setLastName('');
       setVehicleCapacity('');
       setVehicleColor('');
        setVehiclePlate('');
        setVehicleType('');
 
    }
  return (
   <div className='p-7 h-screen flex flex-col justify-between'> 
       <div> 
        <img  className='w-25 mb-7' src="https://static.vecteezy.com/system/resources/previews/027/127/451/non_2x/uber-logo-uber-icon-transparent-free-png.png" alt="" />
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
              <h3 className='text-base font-medium mb-2'>Vehicle Information</h3>
              <div className='flex gap-4 mb-6'>
                <select 
                  required 
                  className='bg-[#eeeeee] w-1/2 rounded px-4 py-2 border text-base placeholder:text-sm' 
                  value={vehicleType} 
                  onChange={(e) => setVehicleType(e.target.value)}
                >
                  <option value="" disabled>Select vehicle type</option>
                  <option value="car">Car</option>
                  <option value="auto">Auto</option>
                  <option value="bike">bike</option>
                  <option value="truck">Truck</option>
                </select>

                <input 
                  required 
                  className='bg-[#eeeeee] w-1/2 rounded px-4 py-2 border text-base placeholder:text-sm' 
                  type="text" 
                  placeholder='Vehicle plate number' 
                  value={vehiclePlate} 
                  onChange={(e) => setVehiclePlate(e.target.value)}
                />
              </div>

              <div className='flex gap-4 mb-6'>
                <input 
                  required 
                  className='bg-[#eeeeee] w-1/2 rounded px-4 py-2 border text-base placeholder:text-sm' 
                  type="text" 
                  placeholder='Vehicle color' 
                  value={vehicleColor} 
                  onChange={(e) => setVehicleColor(e.target.value)}
                />

                <input 
                  required 
                  className='bg-[#eeeeee] w-1/2 rounded px-4 py-2 border text-base placeholder:text-sm' 
                  type="number" 
                  placeholder='Vehicle capacity' 
                  value={vehicleCapacity} 
                  onChange={(e) => setVehicleCapacity(e.target.value)}
                />
              </div>
          

           
          <button 
          className='bg-[#111] text-white font-semibold mb-3 rounded px-4 py-2 w-full text-lg placeholder:text-base'>
            Create Captain Account
          </button>
  
           <p className='text-center'> Already have a account ? <Link to='/capatain-login' className='text-blue-600'>Login here </Link></p>
  
        </form>
  
        </div>
        <div>
          <p className='text-[12px] leading-tight mt-8 '>This site is protected by reCAPTCHA and the
            <span className='underline'>
           GOOGLE Policy</span> and<span className='underline'> Terms of Service</span> apply. By clicking  <span className='underline'>Terms of Use</span> and <span className='underline'>Privacy Policy</span>.
          </p>
          
        </div>
      </div>
  )
}

export default CaptainSignup
