import React, { useState, useContext } from 'react'
import { Link } from 'react-router-dom'
import { UserDataContext } from '../context/contexts'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { apiError } from '../utils/apiError'

const UserLogin = () => {
  const [ email, setEmail ] = useState('')
  const [ password, setPassword ] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const { setUser } = useContext(UserDataContext)
  const navigate = useNavigate()



  const submitHandler = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);

    const userData = {
      email: email,
      password: password
    }

    try {
    const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/users/login`, userData)

    if (response.status === 200) {
      const data = response.data
      setUser(data.user)
      localStorage.setItem('token', data.token)
      navigate('/home')
    }


    setEmail('')
    setPassword('')
    } catch (err) {
      setError(apiError(err, 'Unable to log in. Please try again.'));
    } finally { setBusy(false); }
  }

  return (
    <div className='auth-card'>
      <div>
        <Link to="/" className="brand auth-brand">Uber<span>Move your way.</span></Link>

        <form onSubmit={(e) => {
          submitHandler(e)
        }}>
          {error && <p role="alert" className="mb-3 text-red-700">{error}</p>}
          <h3 className='text-lg font-medium mb-2'>What's your email</h3>
          <input
            required
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
            }}
            className='bg-[#eeeeee] mb-7 rounded-lg px-4 py-2 border w-full text-lg placeholder:text-base'
            type="email"
            aria-label='Email' placeholder='email@example.com'
          />

          <h3 className='text-lg font-medium mb-2'>Enter Password</h3>

          <input
            className='bg-[#eeeeee] mb-7 rounded-lg px-4 py-2 border w-full text-lg placeholder:text-base'
            value={password}
            onChange={(e) => {
              setPassword(e.target.value)
            }}
            required type="password"
            aria-label='Password' placeholder='password'
          />

          <button disabled={busy}
            className='bg-[#111] text-white font-semibold mb-3 rounded-lg px-4 py-2 w-full text-lg placeholder:text-base'
          >Login</button>

        </form>
        <p className='text-center'>New here? <Link to='/signup' className='text-blue-600'>Create new Account</Link></p>
      </div>
      <div>
        <Link
          to='/captain-login'
          className='bg-[#10b461] flex items-center justify-center text-white font-semibold mb-5 rounded-lg px-4 py-2 w-full text-lg placeholder:text-base'
        >Sign in as Captain</Link>
      </div>
    </div>
  )
}

export default UserLogin
