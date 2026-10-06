
import { Link } from 'react-router-dom'
import React, { useState } from 'react'
import { CaptainDataContext } from '../context/contexts';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { apiError } from '../utils/apiError';

const CaptainSignup = () => {

 const navigate = useNavigate();


  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
     const [password, setPassword] = useState('');
     const [firstName, setFirstName] = useState('');
     const [lastName, setLastName] = useState('');


     const [vehicleType, setVehicleType] = useState('');
     const [vehiclePlate, setVehiclePlate] = useState('');
      const [vehicleColor, setVehicleColor] = useState('');
      const [ vehicleCapacity, setVehicleCapacity] = useState('');



     const { setCaptain } = React.useContext(CaptainDataContext);

     const submitHandler = async (e) => {
       e.preventDefault();
       setError('');
       setBusy(true);
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

  try {
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
      } catch (err) {
        setError(apiError(err, 'Unable to create your account. Please try again.'));
      } finally { setBusy(false); }

    }
  return (
   <div className='auth-card'>
       <div>
        <Link to="/" className="brand auth-brand">Uber<span>Move your way.</span></Link>
        <form onSubmit={(e)=>submitHandler(e)}>
          {error && <p role="alert" className="mb-3 text-red-700">{error}</p>}

           <h3 className='text-base font-medium mb-2'>What is your name? </h3>
           <div className='form-row mb-6'>

          <input required

          className='bg-[#eeeeee] w-1/2  rounded px-4 py-2 border text-base placeholder:text-sm' type="text" aria-label='First name' placeholder='First name'
          value={firstName} onChange={(e)=>{
            setFirstName(e.target.value)
          }}/>

          <input required

          className='bg-[#eeeeee]  w-1/2 rounded px-4 py-2 border  text-base placeholder:text-sm' type="text" aria-label='last name' placeholder='last name '
           value={lastName} onChange={(e)=>{
            setLastName(e.target.value)
          }}/>



           </div>

          <h3 className='text-base font-medium mb-2'>What is your email?</h3>


          <input required
      value={email} onChange={(e)=>{
        setEmail(e.target.value)
      }}

          className='bg-[#eeeeee] mb-6 rounded px-4 py-2 border w-full text-base placeholder:text-sm' type="email" aria-label='Email' placeholder='email@example.com'/>



          <h3 className='text-base font-medium mb-2'>Enter password</h3>
           <input required
           value={password} onChange={(p)=>{
            setPassword(p.target.value)
           }}

           className='bg-[#eeeeee] mb-6 rounded px-4 py-2 border w-full text-base placeholder:text-sm' type="password" aria-label='Password' placeholder='password'/>
              <h3 className='text-base font-medium mb-2'>Vehicle Information</h3>
              <div className='form-row mb-6'>
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
                </select>

                <input
                  required
                  className='bg-[#eeeeee] w-1/2 rounded px-4 py-2 border text-base placeholder:text-sm'
                  type="text"
                  aria-label='Vehicle plate number' placeholder='Vehicle plate number'
                  value={vehiclePlate}
                  onChange={(e) => setVehiclePlate(e.target.value)}
                />
              </div>

              <div className='form-row mb-6'>
                <input
                  required
                  className='bg-[#eeeeee] w-1/2 rounded px-4 py-2 border text-base placeholder:text-sm'
                  type="text"
                  aria-label='Vehicle color' placeholder='Vehicle color'
                  value={vehicleColor}
                  onChange={(e) => setVehicleColor(e.target.value)}
                />

                <input
                  required
                  className='bg-[#eeeeee] w-1/2 rounded px-4 py-2 border text-base placeholder:text-sm'
                  type="number"
                  aria-label='Vehicle capacity' placeholder='Vehicle capacity'
                  value={vehicleCapacity}
                  onChange={(e) => setVehicleCapacity(e.target.value)}
                />
              </div>



          <button disabled={busy}
          className='bg-[#111] text-white font-semibold mb-3 rounded px-4 py-2 w-full text-lg placeholder:text-base'>
            Create Captain Account
          </button>

           <p className='text-center'> Already have an account? <Link to='/captain-login' className='text-blue-600'>Login here </Link></p>

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
