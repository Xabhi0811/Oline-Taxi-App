import React, { useEffect , useContext } from 'react'
import { Form, Link } from 'react-router-dom'
import CaptainDetails from '../componets/CaptainDetails'
import RidePopUp from '../componets/RidePopUp'
 import { useState } from 'react'
 import { useLayoutEffect } from 'react';
 import gsap from 'gsap'
import ConfrimRidePopUp from '../componets/ConfirmRidePopUp'
import {SocketContext} from '../context/SocketContext'
import { CaptainDataContext } from '../context/CaptainContext'




const CaptainHome = ( ) => {
  
  const [ridePopUpPanel, setRidePopUpPanel] = useState(false);
  const RidePopUpPanelRef = React.useRef(null);
 
  const [confirmRidePopUpPanel, setConfirmRidePopUpPanel] = useState(false);
  const confirmRidePopUpPanelRef = React.useRef(null);
  
  const {socket} = useContext(SocketContext)
  const {captain} = useContext(CaptainDataContext)
  const [isSocketConnected, setIsSocketConnected] = useState(false);
  const [location, setLocation] = useState({ lat: null, lng: null });
   // ride me data wla 
   const [ride , setRide] = useState(null)

// Track when socket is ready

// ✅ 1st: Manage socket connection and identification
useEffect(() => {
  if (!captain || !captain._id) return;

  const onConnect = () => {
    console.log("✅ Socket connected:", socket.id);
    setIsSocketConnected(true);

    // Identify captain
    socket.emit("json", {
      userId: captain._id,
      userType: "captain",
    });

    // Update backend with socket ID
    socket.emit("update-captain-socket-id", {
     //captainId: captain._id,
      userId: captain._id,
      socketId: socket.id,
    });
  };

  const onDisconnect = () => {
    setIsSocketConnected(false);
    console.log("🔌 Socket disconnected");
  };

  socket.on("connect", onConnect);
  socket.on("disconnect", onDisconnect);

  return () => {
    socket.off("connect", onConnect);
    socket.off("disconnect", onDisconnect);
  };
}, [socket, captain]);


// ✅ 2nd: Watch location and send to backend
useEffect(() => {
  if (!("geolocation" in navigator)) {
    console.warn("🚫 Geolocation not supported.");
    return;
  }
const watchId = navigator.geolocation.watchPosition(
  (position) => {
    console.log("✅ Position fetched:", position);
      console.log("✅ Position fetched:", position);
      console.log("🧠 captain:", captain);
    const { latitude, longitude } = position.coords;
    setLocation({ lat: latitude, lng: longitude });

    if (socket && socket.connected && captain?._id) {
      socket.emit("update-location-captain", {
         userId: captain._id,
        location: { lat: latitude, lng: longitude },
      });
      console.log("📤 Sent to backend:", { lat: latitude, lng: longitude });
    }
  },
  (error) => {
    console.error("❌ Location error:", error.message);
  },
  {
    enableHighAccuracy: true, // 🔁 GPS
    timeout: 20000,           // ⏳ 20s
    maximumAge: 20000            // 🔄 No caching
  }
);


  return () => {
    navigator.geolocation.clearWatch(watchId);
  };
}, [socket, captain]);


 socket.on('new-ride', (data) =>{
  console.log(data)
  setRide(data)
  setRidePopUpPanel(true)

 })



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
  />
</div>


    <div ref={confirmRidePopUpPanelRef} className=" fixed w-full h-screen z-10 bottom-0 translate-y-full  bg-white px-5 py-10 pt-12"> 
       <ConfrimRidePopUp setConfirmRidePopUpPanel={setConfirmRidePopUpPanel}/>
      
    </div>

    </div>
  )
}

export default CaptainHome
