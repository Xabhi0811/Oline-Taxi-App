import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { apiError } from '../utils/apiError';
import { CaptainDataContext } from '../context/contexts';

const CaptainLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const { setCaptain } = React.useContext(CaptainDataContext);
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
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
      setError(apiError(error, 'Unable to log in. Please try again.'));
    } finally { setBusy(false); }
  };

  return (
    <div className='auth-card'>
      <div>
        <Link to="/" className="brand auth-brand">Uber<span>Move your way.</span></Link>
        <form onSubmit={submitHandler}>
          {error && <p role="alert" className="mb-3 text-red-700">{error}</p>}
          <h3 className='text-lg font-medium mb-2'>What is your email</h3>
          <input
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className='bg-[#eeeeee] mb-7 rounded px-4 py-2 border w-full text-lg placeholder:text-base'
            type="email"
            aria-label='Email' placeholder='email@example.com'
          />

          <h3 className='text-lg font-medium mb-2'>Enter password</h3>
          <input
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className='bg-[#eeeeee] mb-7 rounded px-4 py-2 border w-full text-lg placeholder:text-base'
            type="password"
            aria-label='Password' placeholder='password'
          />

          <button disabled={busy}
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
