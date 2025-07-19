import React from 'react'
import { Link } from 'react-router-dom'
import CaptainDetails from '../componets/CaptainDetails'
import RidePopUp from '../componets/RidePopUp'


const CaptainHome = () => {
  return (
    <div className='relative h-screen w-full'>
      {/* Fullscreen Map Image */}
      <img
        src='https://tse4.mm.bing.net/th/id/OIP.CLHyxk-5yNE9voIZWJ4h6gHaDH?rs=1&pid=ImgDetMain&o=7&rm=3'
        className='absolute inset-0 w-full h-full object-cover'
        alt='Map'
      />

      {/* Top Bar */}
      <div className='absolute top-4 left-4 right-4 flex items-center justify-between z-10'>
        {/* Uber Logo */}
        <img
          className='w-16'
          src='https://tse3.mm.bing.net/th/id/OIP.NF9pXP4AlXPqSgrCBRhnsQHaHa?rs=1&pid=ImgDetMain&o=7&rm=3'
          alt='Uber'
        />

        {/* Logout Button */}
        <Link to='/home' className="h-10 w-10 flex items-center justify-center rounded-full bg-white shadow-md">
          <i className="ri-logout-box-r-line text-xl text-black"></i>
        </Link>
      </div>
      <CaptainDetails/>
      <div  className=" fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-6 pt-12"> 
       <RidePopUp/>
       
      
    </div>
    </div>
  )
}

export default CaptainHome
