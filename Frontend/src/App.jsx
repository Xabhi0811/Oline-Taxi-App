import React from 'react'; 
import { Routes, Route } from 'react-router-dom'
import Start from './Pages/Start.jsx'
import UserLogin from './pages/UserLogin.jsx'
import UserSignup from './Pages/UserSignup.jsx'
import CaptainLogin from './pages/CaptainLogin.jsx'
import CaptainSignup from './pages/CaptainSignup.jsx'
import Home from './Pages/Home.jsx'
import { UserProvider } from './context/UserContext.jsx';
import UserProtectWrapper from './Pages/UserProtectWrapper.jsx';
import UserLogout from './Pages/UserLogout.jsx';
import CaptainHome from './Pages/CaptainHome.jsx';



const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Start/>} /> 
      <Route path="/login" element={<UserLogin />} />
      <Route path="/signup" element={<UserSignup />} />
      <Route path="/captain-login" element={<CaptainLogin />} />
     <Route path="/captain-Signup" element={<CaptainSignup />} />


      <Route path='/home' element={<UserProtectWrapper>{<Home/>}</UserProtectWrapper>}/>
       <Route path='/users/logout' element={<UserProtectWrapper>{<UserLogout/>}</UserProtectWrapper>}/>
       <Route path='/captain-home' element={<CaptainHome/>} />
    </Routes>
  )
}

export default App
