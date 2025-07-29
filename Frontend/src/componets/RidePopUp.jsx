import React from 'react'

const RidePopUp = (props) => {
  console.log("RidePopUp props.ride.user:", props.ride?.user);

  return (
    <div>
      <h5 className='p-1 text-center w-[93%] absolute top-0'onClick={()=>{
        props.setRidePopUpPanel(false)
       
       }}><i className=" text-3xl text-gray-200 ri-arrow-down-s-line"></i></h5>
       <h3 className='text-xl font-semibold mb-5 '> New Ride Available ! </h3>
       <div className=" flex items-center justify-between mt-4 p-3 bg-yellow-400 rounded-lg ">
        <div className="flex items-center gap-3 ">
            <img className='h-12 w-12 rounded-full object-cover' src='https://wallpapers.com/images/file/beautiful-woman-with-random-people-in-background-roumbpovzh5jzxj5.jpg' alt='user'/>
            <h2 className='text-xl font-medium'><p>
  {props.ride?.user?.fullname?.firstname || 'NoFirst'} {props.ride?.user?.fullname?.lastname || 'NoLast'}
     </p>
</h2>
        </div>
        <h5 className='text-lg font-semibold'>2.2 Km</h5>
       </div>
      
      <div className='flex gap-2 justify-between flex-col items-center'>

          <div className=" w-full mt-5 ">
            <div className=" flex items-center gap-5 p-2 border-b-2">
               <i className=" text-3xl ri-map-pin-user-line"></i>
                <div>
                <h3 className='text-lg font-medium'>562/11-A</h3>
                <p className='text-sm text-gray-600 '>{props.ride?.pickup}</p>
                </div>
            </div>
            <div className="flex items-center gap-5 p-2 border-b-2">
                <i className=" text-2xl ri-map-pin-fill"></i>
                <div>
                <h3 className='text-lg font-medium'>562/11-A</h3>
                <p className='text-sm text-gray-600 '>{props.ride?.destination}</p>
                </div>
            </div>
            <div className="flex items-center gap-5 p-2 ">
                <i className=" text-2xl ri-currency-line"></i>
                <div>
                <h3 className='text-lg font-medium'>{props.ride?.fare}</h3>
                <p className='text-sm text-gray-600 '>Cash Cash</p>
                </div>
            </div>
          </div>
          
          <div className='mt-5 flex w-full  justify-between  items-center'>
            <button  onClick={()=>{
            props.setConfirmRidePopUpPanel(true)
          }}
        
           className='  bg-green-600 text-white font-semibold p-4 px-10  rounded-xl'>Accept</button>
          

          <button onClick={()=>{
            props.setRidePopUpPanel(false)
          }}  className='  bg-gray-200 text-gray-700 font-semibold p-4  px-10 rounded-xl'>Ignore</button>
          </div>
      </div>

    </div>
  )
}

export default RidePopUp
