import React , {UserContext} from 'react'
import { Routes, Route } from 'react-router-dom'
import Start from './Pages/Start.jsx'
import UserLogin from './pages/UserLogin.jsx'
import UserSignup from './pages/UserSignup.jsx'
import CaptainLogin from './pages/CaptainLogin.jsx'
import CaptainSignup from './pages/CaptainSignup.jsx'
import Home from './Pages/Home.jsx'


const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Start/>} /> 
      <Route path="/login" element={<UserLogin />} />
      <Route path="/Signup" element={<UserSignup />} />
      <Route path="/capatain-login" element={<CaptainLogin />} />
      <Route path="/capatain-Signup" element={<CaptainSignup/>} />
      <Route path='/home' element={<Home/>}/>
    </Routes>
  )
}

export default App
