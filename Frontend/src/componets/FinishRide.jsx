import React from 'react'
import { Link } from 'react-router-dom';

const FinishRide = (props) => {
  return (
<div >
      <h5 className='p-1 text-center w-[93%] absolute top-0'onClick={()=>{
        props.setFinishRidePanel(false)
       
       }}><i className=" text-3xl text-gray-200 ri-arrow-down-s-line"></i></h5>
       <h3 className='text-xl font-semibold mb-5 '> Finish this Ride  ! </h3>
       <div className=" flex items-center justify-between mt-4 p-3 bg-yellow-400 rounded-lg ">
        <div className="flex items-center gap-3 ">
            <img className='h-12 w-12 rounded-full object-cover' src='https://wallpapers.com/images/file/beautiful-woman-with-random-people-in-background-roumbpovzh5jzxj5.jpg' alt='user'/>
            <h2 className='text-xl font-medium'> Apoorva Chauhan</h2>
        </div>
        <h5 className='text-lg font-semibold'>2.2 Km</h5>
       </div>
      
      <div className='flex gap-2 justify-between flex-col items-center'>

          <div className=" w-full mt-5 ">
            <div className=" flex items-center gap-5 p-2 border-b-2">
               <i className=" text-3xl ri-map-pin-user-line"></i>
                <div>
                <h3 className='text-lg font-medium'>562/11-A</h3>
                <p className='text-sm text-gray-600 '>gole mandir </p>
                </div>
            </div>
            <div className="flex items-center gap-5 p-2 border-b-2">
                <i className=" text-2xl ri-map-pin-fill"></i>
                <div>
                <h3 className='text-lg font-medium'>562/11-A</h3>
                <p className='text-sm text-gray-600 '>DD nagar</p>
                </div>
            </div>
            <div className="flex items-center gap-5 p-2 ">
                <i className=" text-2xl ri-currency-line"></i>
                <div>
                <h3 className='text-lg font-medium'>$125</h3>
                <p className='text-sm text-gray-600 '>Cash Cash</p>
                </div>
            </div>
          </div>
          <div className=" mt-10 w-full ">
           


            <Link to='/captain-home'  className='w-full flex justify-center mt-1 bg-green-600 text-lg text-white font-semibold p-4 rounded-xl mb-2'>Finish Ride</Link>
           


          

          </div>

      </div>

    </div>
  )
}

export default FinishRide
