import React from 'react'
import { Link } from 'react-router-dom'

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

      {/* Floating Info Card in Center */}
      <div className='absolute bottom-10 left-1/2 transform -translate-x-1/2 w-[90%] max-w-md bg-white rounded-2xl shadow-xl p-5 z-10'>
        {/* Profile and Earnings */}
        <div className='flex items-center justify-between mb-4'>
          <div className='flex items-center gap-3'>
            <img
              className='h-10 w-10 rounded-full object-cover'
              src='https://live.staticflickr.com/7160/6410037157_8a32776d93_b.jpg'
              alt='Captain'
            />
            <h4 className='text-base font-semibold'>Abhishek Singh Chauhan</h4>
          </div>
          <div className='text-right'>
            <h4 className='text-lg font-bold'>₹295.20</h4>
            <p className='text-sm text-gray-500'>Earned</p>
          </div>
        </div>

        {/* Online Stats */}
        <div className='flex justify-around'>
          <div className="text-center">
            <i className="ri-timer-2-line text-xl text-gray-800"></i>
            <h5 className='text-base font-medium mt-1'>10.2</h5>
            <p className='text-sm text-gray-500'>Hours Online</p>
          </div>
          <div className="text-center">
            <i className="ri-speed-up-line text-xl text-gray-800"></i>
            <h5 className='text-base font-medium mt-1'>10.2</h5>
            <p className='text-sm text-gray-500'>Hours Online</p>
          </div>
          <div className="text-center">
            <i className="ri-booklet-fill text-xl text-gray-800"></i>
            <h5 className='text-base font-medium mt-1'>10.2</h5>
            <p className='text-sm text-gray-500'>Hours Online</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CaptainHome
