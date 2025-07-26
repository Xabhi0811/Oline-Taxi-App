import React, { use } from 'react'
import { useState } from 'react'
import { useLayoutEffect } from 'react';
import gsap from 'gsap'
import 'remixicon/fonts/remixicon.css'
import LocationSearchPanel from '../componets/LocationSearchPanel'; 
import VehiclePanel from '../componets/VehiclePanel';
import ConfirRide from '../componets/ConfirRide';
import LookingForDriver from '../componets/LookingForDriver';
import WaitingForDriver from '../componets/WaitingForDriver';
import axios from 'axios'

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
  const [waitingForDriver , setWaitingForDriver] = useState(false)
  const waitingForDriverRef = React.useRef(null)
  // New state for suggestions and active field
  const [locationSuggestions, setLocationSuggestions] = useState([])
  const [activeField, setActiveField] = useState(null) // 'pickup' or 'destination'

  // Fetch location suggestions from backend
  const fetchSuggestions = async (query) => {
  if (!query) {
    setLocationSuggestions([]);
    return;
  }
  try {
    const token = localStorage.getItem('token'); // ✅ fetch token here
    const encodedQuery = encodeURIComponent(query);

    const res = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/map/get-suggestions?input=${encodedQuery}`,
      {
        headers: {
          Authorization: `Bearer ${token}`, // ✅ attach token
        },
      }
    );
    console.log("Suggestions response:", res.data);

    setLocationSuggestions(res.data.suggestions || []); // ✅ show results
  } catch (err) {
    console.error('Error fetching suggestions:', err.response?.data || err.message); // ✅ log the error
    setLocationSuggestions([]);
  }
};

  // Fetch suggestions when pickup or destination changes and panel is open
  React.useEffect(() => {
    if (panelOpen && activeField === 'pickup' && pickup) {
      fetchSuggestions(pickup);
    } else if (panelOpen && activeField === 'destination' && destination) {
      fetchSuggestions(destination);
    } else {
      setLocationSuggestions([]);
    }
  }, [pickup, destination, panelOpen, activeField]);

  const handleInputClick = (field) => {
    setPanelOpen(true);
    setActiveField(field);
  };

  const handleSelectLocation = (location) => {
    if (activeField === 'pickup') {
      setPickup(location);
    } else if (activeField === 'destination') {
      setDestination(location);
    }
    setPanelOpen(false);
    setActiveField(null);
    setLocationSuggestions([]);
  };

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

 useLayoutEffect(function(){
      if(waitingForDriver){
        gsap.to(waitingForDriverRef.current,{
          transform: 'translateY(0)'
        })
      }else{
        gsap.to(waitingForDriverRef.current,{
          transform: 'translateY(100%)'
        })
      }
 }, [waitingForDriver])

 function findTrip(){
   setVehiclePanel(true)
   setPanelOpen(false)
 }







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
            onClick={() => handleInputClick('pickup')}
            value={pickup}
            onChange={(e) => {
              setPickup(e.target.value);
              if (panelOpen && activeField === 'pickup') {
                fetchSuggestions(e.target.value);
              }
            }}
            type="text" placeholder='Add pick-up location '
            className='bg-[#eee] px-12 py-2 text-lg rounded-lg w-full mt-5'
            autoComplete="off"
          />

          <input
            onClick={() => handleInputClick('destination')}
            value={destination}
            onChange={(e) => {
              setDestination(e.target.value);
              if (panelOpen && activeField === 'destination') {
                fetchSuggestions(e.target.value);
              }
            }}
            required
            type="text" placeholder='Enter your destination'
            className='bg-[#eee] px-12 py-2 text-lg rounded-lg w-full mt-3'
            autoComplete="off"
          />
 

        </form>
        <button onClick={findTrip} className='bg-black text-white px-4 rounded-lg mt-3 h-10 w-full'>Find Trip </button>
        
        </div>
        <div  ref={panelRef} className="h-0 bg-white">
        <LocationSearchPanel 
          locations={locationSuggestions} 
          onSelectLocation={handleSelectLocation}
        />
        </div>
      </div>
     
    <div ref={vehiclePanelRef} className=" fixed w-full z-10 bottom-0 translate-y-full bg-white px-5 py-10 pt-12"> 
        <VehiclePanel  setConfirmRidePanel={setConfirmRidePanel} setVehiclePanel={setVehiclePanel}/>
      
    </div>

     <div ref={confirmRidePanelRef} className=" fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-6 pt-12"> 
        <ConfirRide setConfirmRidePanel={setConfirmRidePanel}  setVehicleFound={setVehicleFound}/>
      
    </div>


     <div ref={vehicleFoundRef} className=" fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-6 pt-12"> 
       <LookingForDriver setVehicleFound={setVehicleFound} />
      
    </div>
      

      <div ref={waitingForDriverRef} className=" fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-6 pt-12"> 
       <WaitingForDriver  waitingForDriver={waitingForDriver} />
      
    </div>




    </div>
  )
}

export default Home
