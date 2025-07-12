import React from 'react'
import { Link } from 'react-router-dom'

const Start = () => {
  return (
    <div>
      <div className='bg-cover bg-center bg-[url(https://images.unsplash.com/photo-1542789392-618ecac2c626?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)] h-screen pt-8 flex justify-between flex-col w-full '>
        <img className='w-16 ml-8' src="https://logospng.org/download/uber/logo-uber-4096.png" alt="" />
        <div className='bg-white py-4 pb-7 px-4'>
          <h2 className='text-3xl font-bold'>GET STARTED WITH UBER</h2>
          <Link to='/Login' className=' flex items-center justify-center w-full bg-black text-white py-3 rounded mt-5'>CONTINUE</Link>
        </div>
      </div>
    </div>
  )
}

export default Start
