import React from 'react';
import { Link } from 'react-router-dom';

const Riding = () => {
  return (
     <div className='h-screen '>
        <Link to='/capatain-home' className=' fixed  right-2 top-2  h-10 w-10 bg-white flex items-center justify-center rounded-full'>
        <i className=" text-lg font-medium ri-home-4-line"></i>
        </Link>
      <div className=' h-1/2'>
       <img src='https://tse4.mm.bing.net/th/id/OIP.CLHyxk-5yNE9voIZWJ4h6gHaDH?rs=1&pid=ImgDetMain&o=7&rm=3'alt='uber map' className='h-full w-full object-cover'/>
      </div>
        <div className='h-1/2 p-4'>
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
        <button className='w-full mt-5 bg-green-600 text-white font-semibold p-2 rounded-xl'> Make a Payment</button>
        
        </div>

     </div>
  );
};

export default Riding