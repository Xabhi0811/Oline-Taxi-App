import React, { useEffect , useContext } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import CaptainDetails from '../componets/CaptainDetails'
import RidePopUp from '../componets/RidePopUp'
 import { useState } from 'react'
 import { useLayoutEffect } from 'react';
 import gsap from 'gsap'
import ConfrimRidePopUp from '../componets/ConfirmRidePopUp'
import {SocketContext, CaptainDataContext} from '../context/contexts'




const CaptainHome = ( ) => {
  
  const [ridePopUpPanel, setRidePopUpPanel] = useState(false);
  const RidePopUpPanelRef = React.useRef(null);
 
  const [confirmRidePopUpPanel, setConfirmRidePopUpPanel] = useState(false);
  const confirmRidePopUpPanelRef = React.useRef(null);
  
  const {socket} = useContext(SocketContext)
  const {captain} = useContext(CaptainDataContext)
   // ride me data wla 
   const [ride , setRide] = useState(null)
   const [rideError, setRideError] = useState('')

// Location belongs to the authenticated socket; the client does not choose an account ID.
useEffect(() => {
  if (!socket || !captain?._id || !navigator.geolocation) return;
  const sendLocation = position => {
    socket.emit('update-location-captain', {
      location: { lat: position.coords.latitude, lng: position.coords.longitude }
    });
  };
  const options = { enableHighAccuracy: true, timeout: 20000, maximumAge: 20000 };
  const locate = () => navigator.geolocation.getCurrentPosition(sendLocation, () => {}, options);
  const watchId = navigator.geolocation.watchPosition(sendLocation, () => {}, options);
  socket.on('ready', locate);
  return () => {
    navigator.geolocation.clearWatch(watchId);
    socket.off('ready', locate);
  };
}, [socket, captain?._id]);
useEffect(() => {
  if (!socket) return;

  const handleNewRide = (data) => {
    console.log(data);
    setRide(data);
    setRidePopUpPanel(true);
  };

  socket.on('new-ride', handleNewRide);

  return () => {
    socket.off('new-ride', handleNewRide);
  };
}, [socket]);


 async function confirmRide() {
  setRideError('');
  try {
  const response = await axios.post(
    `${import.meta.env.VITE_BACKEND_URL}/rides/confirm`,
    {
      rideId: ride._id,
      captainId: captain._id
    },
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('captainToken')}`
      }
    }
  );

  setRidePopUpPanel(false);
  setConfirmRidePopUpPanel(true);
  setRide(response.data);
  sessionStorage.setItem('captainRideId', response.data._id);
  } catch (error) {
    setRideError(error.response?.data?.message || 'Unable to accept ride. Try again.');
  }
}



 useLayoutEffect(function(){
      if(ridePopUpPanel){
        gsap.to(RidePopUpPanelRef.current,{
          transform: 'translateY(0)'
        })
      }else{
        gsap.to(RidePopUpPanelRef.current,{
          transform: 'translateY(100%)'
        })
      }
 }, [ridePopUpPanel])


 
 useLayoutEffect(function(){
      if(confirmRidePopUpPanel){
        gsap.to( confirmRidePopUpPanelRef.current,{
          transform: 'translateY(0)'
        })
      }else{
        gsap.to( confirmRidePopUpPanelRef.current,{
          transform: 'translateY(100%)'
        })
      }
 }, [confirmRidePopUpPanel])

 



  return (
   <div className='h-screen'>
         <div className='fixed p-6 top-0 flex items-center justify-between w-screen'>
          <img className='w-16' src='https://tse3.mm.bing.net/th/id/OIP.NF9pXP4AlXPqSgrCBRhnsQHaHa?rs=1&pid=ImgDetMain&o=7&rm=3' alt='home'/>  
           <Link to='/home' className='  h-10 w-10 bg-white flex items-center justify-center rounded-full'>
        <i className=" text-lg font-medium ri-logout-circle-r-line"></i>
        </Link>
         </div>
      <div className=' h-3/5'>
       <img src='https://tse4.mm.bing.net/th/id/OIP.CLHyxk-5yNE9voIZWJ4h6gHaDH?rs=1&pid=ImgDetMain&o=7&rm=3'alt='uber map' className='h-full w-full object-cover'/>
      </div>

        <div className="h-2/5 p-6 ">
       <CaptainDetails/>

      </div>

       <div ref={RidePopUpPanelRef} className="fixed w-full z-10 bottom-0 translate-y-full bg-white px-5 py-10 pt-12"> 
  <RidePopUp 
    ride={ride} 
    setRidePopUpPanel={setRidePopUpPanel} 
    setConfirmRidePopUpPanel={setConfirmRidePopUpPanel} 
    ConfrimRide={confirmRide}
  />
  {rideError && <p role="alert" className="text-red-700">{rideError}</p>}
</div>


    <div ref={confirmRidePopUpPanelRef} className=" fixed w-full h-screen z-10 bottom-0 translate-y-full  bg-white px-5 py-10 pt-12"> 
       <ConfrimRidePopUp 
       ride={ride}
       setConfirmRidePopUpPanel={setConfirmRidePopUpPanel}/>
      
    </div>

    </div>
  )
}

export default CaptainHome
