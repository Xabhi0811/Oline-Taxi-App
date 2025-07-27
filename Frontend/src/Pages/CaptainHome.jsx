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




const CaptainHome = () => {
  
  const [ridePopUpPanel, setRidePopUpPanel] = useState(true);
  const RidePopUpPanelRef = React.useRef(null);
 
  const [confirmRidePopUpPanel, setConfirmRidePopUpPanel] = useState(false);
  const confirmRidePopUpPanelRef = React.useRef(null);
  
  const {socket} = useContext(SocketContext)
  const {captain} = useContext(CaptainDataContext)

useEffect(() => {
  if (socket && captain?._id) {
    const handleConnect = () => {
      console.log("🛰️ Socket connected in CaptainHome, emitting ID:", captain._id);
      socket.emit("json", {
        userType: "captain",
        userId: captain._id,
      });
    };

    if (socket.connected) {
      handleConnect(); // already connected
    } else {
      socket.on("connect", handleConnect); // wait for connection
    }

    return () => {
      socket.off("connect", handleConnect); // clean up
    };
  } else {
    console.log("⛔ Captain or socket missing", { captain, socket });
  }
}, [socket, captain?._id]);

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
