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
  
  const [ridePopUpPanel, setRidePopUpPanel] = useState(true);
  const RidePopUpPanelRef = React.useRef(null);
 
  const [confirmRidePopUpPanel, setConfirmRidePopUpPanel] = useState(false);
  const confirmRidePopUpPanelRef = React.useRef(null);
  
  const {socket} = useContext(SocketContext)
  const {captain} = useContext(CaptainDataContext)
  const [isSocketConnected, setIsSocketConnected] = useState(false);
  const [location, setLocation] = useState({ ltd: null, lng: null });
// Track when socket is ready

  useEffect(() => {
    if (!captain || !captain._id) {
      console.warn("🛑 Captain data not available yet");
      return;
    }

    if (!socket.connected) {
      console.log("📡 Waiting for socket to connect...");
    }

    socket.on("connect", () => {
      console.log("✅ Socket connected in listener:", socket.id);
      setIsSocketConnected(true);

      console.log("👤 Captain ready:", captain);
      console.log("📡 Socket is ready:", socket.id);

      // 1️⃣ Identify captain to backend
      socket.emit("json", {
        userId: captain._id,
        userType: "captain",
      });

      // 2️⃣ Emit socket ID to backend
      socket.emit("update-captain-socket-id", {
        captainId: captain._id,
        socketId: socket.id,
      });

      // 3️⃣ Start watching location
      if ("geolocation" in navigator) {
        const watchId = navigator.geolocation.watchPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            console.log("📍 Location found:", latitude, longitude);
            setLocation({ ltd: latitude, lng: longitude });

            // Send location to backend
            sendLocationToBackend(latitude, longitude);
          },
          (error) => {
            console.error("❌ Error getting location:", error.message);
          },
          {
            enableHighAccuracy: true,
            timeout: 15000,
            maximumAge: 0,
          }
        );

        // Cleanup location watcher
        return () => {
          navigator.geolocation.clearWatch(watchId);
        };
      } else {
        console.warn("🚫 Geolocation not supported in this browser.");
      }
    });

    socket.on("disconnect", () => {
      setIsSocketConnected(false);
      console.log("🔌 Socket disconnected");
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
    };
  }, [captain]);

  // 🔁 Send location to backend
  const sendLocationToBackend = (lat, lng) => {
    if (!captain?._id) return;
    socket.emit("update-location-captain", {
      captainId: captain._id,
      location: { ltd: lat, lng: lng },
    });
    console.log("📍 Sent location update:", { lat, lng });
  };

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

       <div ref={RidePopUpPanelRef} className=" fixed w-full z-10 bottom-0 translate-y-full  bg-white px-5 py-10 pt-12"> 
       <RidePopUp setRidePopUpPanel={setRidePopUpPanel} setConfirmRidePopUpPanel={setConfirmRidePopUpPanel} />
      
    </div>

    <div ref={confirmRidePopUpPanelRef} className=" fixed w-full h-screen z-10 bottom-0 translate-y-full  bg-white px-5 py-10 pt-12"> 
       <ConfrimRidePopUp setConfirmRidePopUpPanel={setConfirmRidePopUpPanel}/>
      
    </div>

    </div>
  )
}

export default CaptainHome
