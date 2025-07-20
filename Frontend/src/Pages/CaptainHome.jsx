import React from 'react'
import { Link } from 'react-router-dom'
import CaptainDetails from '../componets/CaptainDetails'



const CaptainHome = () => {
  return (
   <div className='h-screen'>
         <div className='fixed p-3 top-0 flex items-center justify-between w-screen'>
          <img className='w-16' src='https://tse3.mm.bing.net/th/id/OIP.NF9pXP4AlXPqSgrCBRhnsQHaHa?rs=1&pid=ImgDetMain&o=7&rm=3' alt='home'/>  
           <Link to='/home' className='  h-10 w-10 bg-white flex items-center justify-center rounded-full'>
        <i className=" text-lg font-medium ri-logout-circle-r-line"></i>
        </Link>
         </div>
      <div className=' h-1/2'>
       <img src='https://tse4.mm.bing.net/th/id/OIP.CLHyxk-5yNE9voIZWJ4h6gHaDH?rs=1&pid=ImgDetMain&o=7&rm=3'alt='uber map' className='h-full w-full object-cover'/>
      </div>

        <div className="h-1/2 p-4 ">
      <div className='flex items-center justify-between'>
        <div className='flex items-center justify-start gap-4'>
          <img className=' h-10 w-10 rounded-full object-cover' src='https://live.staticflickr.com/7160/6410037157_8a32776d93_b.jpg' alt='driver'/>
          <h4 className='text-lg font-medium'>Abhishek Singh Chauhan</h4>
        </div>
        <div className='flex justify-center gap-5 items-start'>
          <h4 className='text-xl font-semibold '>$296</h4>
          <p className='text-sm bg-gray-600'>Earned</p>
        </div>
      </div>   
       <div className='flex items-center justify-center gap-15 mt-10'>
             <div className=" text-center">
          <i className=" text-font-thin ri-timer-2-line"></i>
          <h5 className='text-2xl mb-2 font-medium'>10:02</h5>
          <p className=' text-sm text-gray-600'>Hours online</p>

        </div>

        <div className="text-center">
          <i className=" text-font-thin ri-speed-up-line"></i>
           <h5 className='text-2xl mb-2 font-medium'>10:02</h5>
          <p className=' text-sm text-gray-600'>Hours online</p>

        </div>

        <div className="text-center">
          <i className="texr-2xl text-font-thin ri-booklet-fill"></i>
           <h5 className='text-2xl mb-2 font-medium'>10:02</h5>
          <p className=' text-sm text-gray-600'>Hours online</p>

        </div>

      </div>
       


      </div>
    </div>
  )
}

export default CaptainHome
