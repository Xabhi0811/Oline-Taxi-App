import React from 'react'
import { Link } from 'react-router-dom'


const CaptainHome = () => {
  return (
      <div className='h-screen '>
        <div className='fixed p-3 top-0  flex items-center justify-between w-screen'>
          <img className=' w-16 ' src='https://tse3.mm.bing.net/th/id/OIP.NF9pXP4AlXPqSgrCBRhnsQHaHa?rs=1&pid=ImgDetMain&o=7&rm=3 ' alt='' />
        <Link to='/home' className="bg-white h-10 w-10 flex items-center justify-center rounded-full">
            <i className=" text-3xl font-medium ri-logout-box-r-line"></i>
        </Link>
        </div>



      {/* Top half - Image */}
      <div className="h-1/2">
        <img
          className='w-full h-full object-cover'
          src='https://tse4.mm.bing.net/th/id/OIP.CLHyxk-5yNE9voIZWJ4h6gHaDH?rs=1&pid=ImgDetMain&o=7&rm=3'
          alt='car'
        />
      </div>

      {/* Bottom half - Details */}
      <div className="h-1/2 p-4 flex flex-col justify-between">
        {/* Driver Info */}
        <div className="flex items-center justify-between">
          <img
            className='h-20'
            src='https://tse1.mm.bing.net/th/id/OIP.90_IXyFPb47LZ_AYAe1ylAHaEK?rs=1&pid=ImgDetMain&o=7&rm=3'
            alt='car'
          />
          <div className="text-right">
            <h2 className='text-2xl font-medium'>Abhishek</h2>
            <h2 className='text-xl font-semibold -mt-1 -mb-1'>MP29 AB08</h2>
            <h2 className='text-sm text-gray-600'>Swift</h2>
          </div>
        </div>

        {/* Ride Info */}
        <div className='mt-5'>
          <div className="flex items-center gap-2 p-2 border-b-2">
            <i className="text-2xl ri-map-pin-fill"></i>
            <div>
              <h3 className='text-lg font-medium'>562/11-A</h3>
              <p className='text-sm text-gray-600'>DD nagar</p>
            </div>
          </div>

          <div className="flex items-center gap-5 p-2">
            <i className="text-2xl ri-currency-line"></i>
            <div>
              <h3 className='text-lg font-medium'>$125</h3>
              <p className='text-sm text-gray-600'>Cash</p>
            </div>
          </div>
        </div>


      </div>
    </div>
  )
}

export default CaptainHome
