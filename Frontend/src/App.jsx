import React from 'react'; 
import { Routes, Route } from 'react-router-dom'
import Start from './Pages/Start.jsx'
import UserLogin from './pages/UserLogin.jsx'
import UserSignup from './Pages/UserSignup.jsx'
import CaptainLogin from './Pages/CaptainLogin.jsx'
import CaptainSignup from './pages/CaptainSignup.jsx'
import Home from './Pages/Home.jsx'
import { UserProvider } from './context/UserContext.jsx';
import UserProtectWrapper from './Pages/UserProtectWrapper.jsx';
import UserLogout from './Pages/UserLogout.jsx';
import CaptainHome from './Pages/CaptainHome.jsx';
import CaptainProtectWrapper from './Pages/CaptainProtectWrapper.jsx';
import Riding from './Pages/Riding.jsx';
import CaptainRiding from './Pages/CaptainRiding.jsx';



const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Start/>} /> 
      <Route path="/login" element={<UserLogin />} />
      <Route path="/signup" element={<UserSignup />} />
      <Route path='/riding' element={<Riding/>}/>
      <Route path="/captain-login" element={<CaptainLogin />} />
     <Route path="/captain-Signup" element={<CaptainSignup />} />
      <Route path='/home' element={<UserProtectWrapper>{<Home/>}</UserProtectWrapper>}/>
       <Route path='/users/logout' element={<UserProtectWrapper>{<UserLogout/>}</UserProtectWrapper>}/>
       <Route path='/captain-home' element={<CaptainProtectWrapper><CaptainHome/></CaptainProtectWrapper>} />
       <Route path='/captain-riding' element={<CaptainRiding/>} />
    </Routes>
  )
}

export default App
