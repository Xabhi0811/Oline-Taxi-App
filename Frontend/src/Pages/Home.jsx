import React, { use } from 'react'
import { useState } from 'react'
import { useLayoutEffect } from 'react';
import gsap from 'gsap'
import 'remixicon/fonts/remixicon.css'
import LocationSearchPanel from '../componets/LocationSearchPanel';
import VehiclePanel from '../componets/VehiclePanel';
import ConfirRide from '../componets/ConfirRide';
import LookingForDriver from '../componets/LookingForDriver';

const Home = () => {
    const [pickup , setPickup ] = useState('')
    const [destination , setDestination ] = useState('')
    const [panelOpen , setPanelOpen ] = useState(false)
   const panelRef = React.useRef(null)
   const panelCloseRef = React.useRef(null)
  const [vehiclePanel , setVehiclePanel] = useState(false)
  const vehiclePanelRef = React.useRef(null)
  const [confirmRidePanel , setConfirmRidePanel] = useState(false)
  const confirmRidePanelRef = React.useRef(null)
  const [vehicleFound, setVehicleFound] = useState(false)
  const vehicleFoundRef = React.useRef(null)


  const SubmitHandler = (e) => {
    e.preventDefault()
  }

useLayoutEffect(() => {
  if (panelOpen) {
    gsap.to(panelRef.current, {
      height: '70%',
      padding: 24,
    });

    gsap.to(panelCloseRef.current, {
      opacity: 1,
    });
  } else {
    gsap.to(panelRef.current, {
      height: '0%',
      padding: 0,
    });

    gsap.to(panelCloseRef.current, {
      opacity: 0,
    });
  }
}, [panelOpen]);


 useLayoutEffect(function(){
      if(vehiclePanel){
        gsap.to(vehiclePanelRef.current,{
          transform: 'translateY(0)'
        })
      }else{
        gsap.to(vehiclePanelRef.current,{
          transform: 'translateY(100%)'
        })
      }
 }, [vehiclePanel])

 
 useLayoutEffect(function(){
      if(confirmRidePanel){
        gsap.to(confirmRidePanelRef.current,{
          transform: 'translateY(0)'
        })
      }else{
        gsap.to(confirmRidePanelRef.current,{
          transform: 'translateY(100%)'
        })
      }
 }, [confirmRidePanel])


 
 useLayoutEffect(function(){
      if(vehicleFound){
        gsap.to(vehicleFoundRef.current,{
          transform: 'translateY(0)'
        })
      }else{
        gsap.to(vehicleFoundRef.current,{
          transform: 'translateY(100%)'
        })
      }
 }, [vehicleFound])






  return (

    <div>
      <div className="h-screen relative  overflow-hidden">
        <img className='w-20 absolute left-5 top-5' src='https://tse3.mm.bing.net/th/id/OIP.NF9pXP4AlXPqSgrCBRhnsQHaHa?rs=1&pid=ImgDetMain&o=7&rm=3' alt='Uber Logo'  />
          <div  className='h-screen w-screen'>
             <img src='https://tse4.mm.bing.net/th/id/OIP.CLHyxk-5yNE9voIZWJ4h6gHaDH?rs=1&pid=ImgDetMain&o=7&rm=3'alt='uber map' className='h-full w-full object-cover'/>
             </div>
      </div>
      <div className=" flex flex-col justify-end h-screen absolute w-full top-0 "> 
        <div className="h-[30%] p-6 bg-white relative">
           <h5 ref={panelCloseRef} onClick={()=>{
            setPanelOpen(false)
           }} className=' absolute opacity-0 top-6 right-6 text-2xl'>
            <i className="ri-arrow-down-wide-line"></i>
           </h5>

          <h4 className='text-2xl font-semibold'> From a trip</h4>
        <form onSubmit={(e)=>{
          SubmitHandler(e)
        }}>
          <div className="line absolute h-16 w-1 top-[45%] left-10 bg-gray-900 rounded-full"></div>
         
          <input
           /*  logic up down wla */
           onClick={()=>{
            setPanelOpen(true)
           }}

           value={pickup} onChange={(e)=>setPickup(e.target.value)}
           type="text" placeholder='Add pick-up location ' 
           className='bg-[#eee] px-12 py-2 text-lg rounded-lg w-full mt-5'
            />


          <input  
          onClick={()=>{
            setPanelOpen(true)
           }}

          value={destination} onChange={(e)=>setDestination(e.target.value)}
          required
           type="text" placeholder='Enter your destination' 
          className='bg-[#eee] px-12 py-2 text-lg rounded-lg w-full mt-3' 
          />
 

        </form></div>
        <div  ref={panelRef} className="h-0 bg-white">
        <LocationSearchPanel setPanelOpen={setPanelOpen} setVehiclePanel={setVehiclePanel}/>
        </div>
      </div>
     
    <div ref={vehiclePanelRef} className=" fixed w-full z-10 bottom-0 translate-y-full bg-white px-5 py-10 pt-12"> 
        <VehiclePanel  setConfirmRidePanel={setConfirmRidePanel} setVehiclePanel={setVehiclePanel}/>
      
    </div>

     <div ref={confirmRidePanelRef} className=" fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-6 pt-12"> 
        <ConfirRide setConfirmRidePanel={setConfirmRidePanel}  setVehicleFound={setVehicleFound}/>
      
    </div>


     <div ref={vehicleFoundRef} className=" fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-6 pt-12"> 
       <LookingForDriver />
      
    </div>




    </div>
  )
}

export default Home
