import React from 'react'

const LookingForDriver = (props) => {
  return (
    <div>
      <h5 className='p-1 text-center w-[93%] absolute top-0'onClick={()=>{
        props.setVehicleFound(false)
       }}><i className=" text-3xl text-gray-200 ri-arrow-down-s-line"></i></h5>
       <h3 className='text-xl font-semibold mb-5 '> Looking for a Driver </h3>
      
      <div className='flex gap-2 justify-between flex-col items-center'>
          <img className='h-20' src='https://tse1.mm.bing.net/th/id/OIP.90_IXyFPb47LZ_AYAe1ylAHaEK?rs=1&pid=ImgDetMain&o=7&rm=3'alt='car'/>
          <div className=" w-full mt-5 ">
            <div className=" flex items-center gap-5 p-2 border-b-2">
               <i className=" text-3xl ri-map-pin-user-line"></i>
                <div>
                <h3 className='text-lg font-medium'>562/11-A</h3>
                <p className='text-sm text-gray-600 '>{props.pickup}</p>
                </div>
            </div>
            <div className="flex items-center gap-5 p-2 border-b-2">
                <i className=" text-2xl ri-map-pin-fill"></i>
                <div>
                <h3 className='text-lg font-medium'>562/11-A</h3>
                <p className='text-sm text-gray-600 '>{props.destination}</p>
                </div>
            </div>
            <div className="flex items-center gap-5 p-2 ">
                <i className=" text-2xl ri-currency-line"></i>
                <div>
                <h3 className='text-lg font-medium'>{props.fare[props.vehicleType]}</h3>
                <p className='text-sm text-gray-600 '>Cash Cash</p>
                </div>
            </div>
          </div>
         
      </div>




    </div>
  )
}

export default LookingForDriver
