import React from 'react'
import { Link } from 'react-router-dom';
import { useState } from 'react';
import gsap from 'gsap'
import { useLayoutEffect } from 'react';
import FinishRide from '../componets/FinishRide';

const CaptainRiding = () => {
 
  const [finishRidePanel, setFinishRidePanel] = useState(false);
  const finishPanelRef = React.useRef(null);

 useLayoutEffect(function(){
      if(finishRidePanel){
        gsap.to(finishPanelRef.current,{
          transform: 'translateY(0)'
        })
      }else{
        gsap.to( finishPanelRef.current,{
          transform: 'translateY(100%)'
        })
      }
 }, [finishRidePanel])


  return (
   <div className='h-screen relative'>
    
         <div className='fixed p-6 top-0 flex items-center justify-between w-screen'>
          <img className='w-16' src='https://tse3.mm.bing.net/th/id/OIP.NF9pXP4AlXPqSgrCBRhnsQHaHa?rs=1&pid=ImgDetMain&o=7&rm=3' alt='home'/>  
           <Link to='/home' className='  h-10 w-10 bg-white flex items-center justify-center rounded-full'>
        <i className=" text-lg font-medium ri-logout-circle-r-line"></i>
        </Link>
         </div>
      <div className=' h-4/5'>
       <img src='https://tse4.mm.bing.net/th/id/OIP.CLHyxk-5yNE9voIZWJ4h6gHaDH?rs=1&pid=ImgDetMain&o=7&rm=3'alt='uber map' className='h-full w-full object-cover'/>
      </div>

        <div className="h-1/5 p-6 bg-yellow-400 flex items-center relative justify-between "
          onClick={()=>{
            setFinishRidePanel(true)
          }}

        >
        <h5 className='p-1 text-center w-[95%] absolute top-0'onClick={()=>{
     
       
       }}><i className=" text-3xl text-gray-200 ri-arrow-down-s-line"></i></h5>
        
        <h4 className='text-xl font-semibold'> 4 KM away</h4>
        <button className=' bg-green-600 text-white font-semibold p-4 px-10  rounded-xl'> Complete Ride </button>
        </div>
       
    <div ref={finishPanelRef} className=" fixed w-full h-screen z-10 bottom-0 translate-y-full  bg-white px-5 py-10 pt-12"> 
       <FinishRide setFinishRidePanel={setFinishRidePanel}/>
      
    </div>

    </div>
  )
}

export default CaptainRiding
