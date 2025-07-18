import React from 'react'

const WaitingForDriver = (props) => {
  return (
       <div>
      <h5 className='p-1 text-center w-[93%] absolute top-0'onClick={()=>{
        props.setWaitingForDriver(false)
       }}><i className=" text-3xl text-gray-200 ri-arrow-down-s-line"></i></h5>
         
         <div className=" flex items-center justify-between ">
          <img className='h-12' src='https://tse1.mm.bing.net/th/id/OIP.90_IXyFPb47LZ_AYAe1ylAHaEK?rs=1&pid=ImgDetMain&o=7&rm=3'alt='car'/>
          <div className="text-right">
            <h2 className='text-2lg font-medium'>Abhishek</h2>
            <h2 className='text-xl font-semibold -mt-1 -mb-1'>MP29 AB08</h2>
            <h2 className='text-sm text-gray-600'>Swift</h2>
          </div>
         </div>
      
      <div className='flex gap-2 justify-between flex-col items-center'>
  
          <div className=" w-full mt-5 ">
            <div className=" flex items-center gap-5 p-2 border-b-2">
               <i className=" text-3xl ri-map-pin-user-line"></i>
                <div>
                <h3 className='text-lg font-medium'>562/11-A</h3>
                <p className='text-sm text-gray-600 '>gole mandir </p>
                </div>
            </div>
            <div className="flex items-center gap-5 p-2 border-b-2">
                <i className=" text-2xl ri-map-pin-fill"></i>
                <div>
                <h3 className='text-lg font-medium'>562/11-A</h3>
                <p className='text-sm text-gray-600 '>DD nagar</p>
                </div>
            </div>
            <div className="flex items-center gap-5 p-2 ">
                <i className=" text-2xl ri-currency-line"></i>
                <div>
                <h3 className='text-lg font-medium'>$125</h3>
                <p className='text-sm text-gray-600 '>Cash Cash</p>
                </div>
            </div>
          </div>
         
      </div>




    </div>
  )
}

export default WaitingForDriver
