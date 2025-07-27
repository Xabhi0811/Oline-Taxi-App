import React ,{useContext} from 'react'
import {CaptainDataContext} from '../context/CaptainContext'

const CaptainDetails = () => {
  const {captain} = useContext(CaptainDataContext)
  return (
    <div>
       <div className='flex items-center justify-between'>
        <div className='flex items-center justify-start gap-4'>
          <img className=' h-10 w-10 rounded-full object-cover' src='https://th.bing.com/th/id/OIP.Z2_5btI6r--zidbP0gH-MQHaKL?w=140&h=193&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3' alt='driver'/>
          <h4 className='text-lg font-medium capitaize'>{captain.fullname.firstname + " " +captain.fullname.lastname}</h4>
        </div>
        <div className='flex justify-center gap-5 items-start'>
          <h4 className='text-xl font-semibold'>$296</h4>
          <p className='text-lg '>Earned</p>
        </div>
      </div>   
       <div className='flex items-center justify-center gap-15 mt-10 rounded-xl bg-gray-100 p-4'>
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
  )
}

export default CaptainDetails
