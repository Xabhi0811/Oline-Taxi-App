import React from 'react'

const ConfirRide = () => {
  return (
    <div>
      <h5 className='p-1 text-center w-[93%] absolute top-0'onClick={()=>{
        props.setVehiclePanel(false)
       }}><i className=" text-3xl text-gray-200 ri-arrow-down-s-line"></i></h5>
       <h3 className='text-xl font-semibold mb-5 '> Confrim your Ride  </h3>
      
      <div className='flex justify-between flex-col items-center'>
          <img src='https://tse1.mm.bing.net/th/id/OIP.90_IXyFPb47LZ_AYAe1ylAHaEK?rs=1&pid=ImgDetMain&o=7&rm=3'alt='car'/>
          <div className=" w-full ">
            <div className=""></div>
            <div className=""></div>
            <div className=""></div>
          </div>
          <button className='w-full bg-green-600 text-white font-semibold p-2 rounded-xl'>Confirm</button>
      </div>




    </div>
  )
}

export default ConfirRide
