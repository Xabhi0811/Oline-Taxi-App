import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CaptainDataContext } from '../context/CaptainContext';

const CaptainLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { captain, setCaptain } = useContext(CaptainDataContext);
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    const captain = {
      email: email,
      password: password
    };

    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/captains/login`, captain);
      if (response.status === 200) {
        const data = response.data;
        setCaptain(data.captain);
        localStorage.setItem('captainToken', data.token);
        navigate('/captain-home');
        setEmail('');
        setPassword('');
      }
    } catch (error) {
      console.error("Login failed", error);
      alert("Invalid credentials or server error.");
    }
  };

  return (
    <div className='p-7 h-screen flex flex-col justify-between'> 
      <div> 
        <img 
          className='w-20 mb-3' 
          src="https://static.vecteezy.com/system/resources/previews/027/127/451/non_2x/uber-logo-uber-icon-transparent-free-png.png" 
          alt="Uber Logo" 
        />
        <form onSubmit={submitHandler}>
          <h3 className='text-lg font-medium mb-2'>What is your email</h3>
          <input 
            required 
            value={email} 
            onChange={(e) => setEmail(e.target.value)}
            className='bg-[#eeeeee] mb-7 rounded px-4 py-2 border w-full text-lg placeholder:text-base' 
            type="email" 
            placeholder='email@example.com'
          />

          <h3 className='text-lg font-medium mb-2'>Enter password</h3>
          <input 
            required 
            value={password} 
            onChange={(e) => setPassword(e.target.value)}
            className='bg-[#eeeeee] mb-7 rounded px-4 py-2 border w-full text-lg placeholder:text-base' 
            type="password" 
            placeholder='password'
          />
          
          <button 
            className='bg-[#111] text-white font-semibold mb-3 rounded px-4 py-2 w-full text-lg'>
            Login
          </button>

          <p className='text-center'>
            Join a fleet? <Link to='/captain-Signup' className='text-blue-600'>Register as a captain</Link>
          </p>
        </form>
      </div>
      
      <div>
        <Link 
          to='/login' 
          className='flex items-center justify-center bg-[#d5622d] text-white font-semibold mb-5 rounded px-4 py-2 w-full text-lg'>
          Sign in as user
        </Link>
      </div>
    </div>
  );
};

export default CaptainLogin;
