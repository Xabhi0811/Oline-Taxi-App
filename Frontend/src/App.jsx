import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home.jsx'
import UserLogin from './pages/UserLogin.jsx'
import UserSignup from './pages/UserSignup.jsx'
import CaptainLogin from './pages/CaptainLogin.jsx'
import CaptainSignup from './pages/CaptainSignup.jsx'


const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<UserLogin />} />
      <Route path="/Signup" element={<UserSignup />} />
      <Route path="/capatain-login" element={<CaptainLogin />} />
      <Route path="/capatain-Signup" element={<CaptainSignup/>} />
    </Routes>
  )
}

export default App
