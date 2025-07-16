import React from 'react'
import { useState } from 'react'
import { useGSAP } from 'react-gsap';
import gsap from 'gsap'
import 'remixicon/fonts/remixicon.css'

const Home = () => {
    const [pickup , setPickup ] = useState('')
    const [destination , setDestination ] = useState('')
    const [panelOpen , setPanelOpen ] = useState(false)
   const panelRef = React.useRef(null)
   const panelCloseRef = React.useRef(null)
  const SubmitHandler = (e) => {
    e.preventDefault()
  }


  useGSAP(function(){
    if(panelOpen){
      
    gsap.to(panelRef.current,{

    height: '70%',
     padding: 24
  })
    
    gsap.to(panelCloseRef.current, {
      opacity: 1
    })
   } else{
      
    gsap.to(panelRef.current,{

    height: '0%'
    })
     gsap.to(panelCloseRef.current,{
      opacity: 0
     })
  }
  },[panelOpen])
  
  return (
    <div>
      <div className="h-screen relative">


        <img className='w-20 absolute left-5 top-5' src='https://tse3.mm.bing.net/th/id/OIP.NF9pXP4AlXPqSgrCBRhnsQHaHa?rs=1&pid=ImgDetMain&o=7&rm=3' alt='Uber Logo'  />
          <div className='h-screen w-screen'>
             <img src='https://tse4.mm.bing.net/th/id/OIP.CLHyxk-5yNE9voIZWJ4h6gHaDH?rs=1&pid=ImgDetMain&o=7&rm=3'alt='uber map' className='h-full w-full object-cover'/>
             </div>
      </div>
      <div className=" flex flex-col justify-end h-screen absolute  w-full top-0 "> 
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
         <LocationSearchPanel />
        </div>
      </div>
    </div>
  )
}

export default Home
