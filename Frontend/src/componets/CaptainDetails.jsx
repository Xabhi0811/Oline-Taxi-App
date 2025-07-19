import React from 'react'

const CaptainDetails = () => {
  return (
    <div>
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

export default CaptainDetails
