import React from 'react'

const VehiclePanel = (props) => {
  return (
    <div>
      <h5 className='p-1 text-center w-[93%] absolute top-0'onClick={()=>{
        props.setVehiclePanel(false)
       }}><i className=" text-3xl text-gray-200 ri-arrow-down-s-line"></i></h5>
       <h3 className='text-xl font-semibold mb-5 '> Choose a vehicle </h3>

      <div onClick={()=>{
        props.setConfirmRidePanel(true)
      }} className=" flex border-2 border-transparent   active:border-black  rounded-xl w-full  iteams-center justify-between p-5 mb-2">
        <img className='h-15' src='https://tse1.mm.bing.net/th/id/OIP.90_IXyFPb47LZ_AYAe1ylAHaEK?rs=1&pid=ImgDetMain&o=7&rm=3' alt='car'/>
        
        <div className='w-1/2'>
          <h4 className='font-medium text-base'> UBERGO<span> <i className="ri-user-fill"></i> </span>4</h4>
          <h5 className='font-medium text-sm'> 2 min away </h5>
          <p className='font-normal text-xs text-grey-600'> AFFordable, conpact rides</p>
        </div>
       <h2 className='text-2xl font-semibold'>$145</h2>
      </div>

      <div onClick={()=>{
        props.setConfirmRidePanel(true)
      }} className=" flex border-2 border-transparent active:border-black rounded-xl w-full  iteams-center justify-between p-5 mb-2">
        <img className='h-15' src='https://cdn-icons-png.flaticon.com/512/8965/8965777.png' alt='bike'/>
        
        <div className='w-1/2'>
          <h4 className='font-medium text-base'> UBERGO<span> <i className="ri-user-fill"></i> </span>2</h4>
          <h5 className='font-medium text-sm'> 15 min away </h5>
          <p className='font-normal text-xs text-grey-600'> AFFordable, conpact rides</p>
        </div> 
       <h2 className='text-2xl font-semibold'>$80</h2>
      </div>
        
        <div onClick={()=>{
        props.setConfirmRidePanel(true)
        }} className=" flex border-2 border-transparent active:border-black rounded-xl w-full  iteams-center justify-between p-5 mb-2">
        <img className='h-15' src='https://th.bing.com/th/id/OIP.gERohywpalGF3NjolmHt5wHaE7?w=267&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3' alt='Auto'/>
        
        <div className='w-1/2'>
          <h4 className='font-medium text-base'> UBERGO<span> <i className="ri-user-fill"></i> </span>3</h4>
          <h5 className='font-medium text-sm'> 10 min away </h5>
          <p className='font-normal text-xs text-grey-600'> AFFordable, conpact rides</p>
        </div>
       <h2 className='text-2xl font-semibold'>$100</h2>
      </div>



    </div>
  )
}

export default VehiclePanel
