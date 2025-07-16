import React from 'react'

const Home = () => {
  const SubmitHandler = () => {
  }
  return (
    <div>
      <div className="h-screen relative">


        <img className='w-20 absolute left-5 top-5' src='https://tse3.mm.bing.net/th/id/OIP.NF9pXP4AlXPqSgrCBRhnsQHaHa?rs=1&pid=ImgDetMain&o=7&rm=3' alt='Uber Logo'  />
          <div className='h-screen w-screen'>
             <img src='https://tse4.mm.bing.net/th/id/OIP.CLHyxk-5yNE9voIZWJ4h6gHaDH?rs=1&pid=ImgDetMain&o=7&rm=3'alt='uber map' className='h-full w-full object-cover'/>
             </div>
      </div>
      <div className=" flex flex-col justify-end h-screen absolute  w-full top-0 "> 
        <div className="h-[30%] p-5 bg-white relative"><h4 className='text-2xl font-semibold'> From a trip</h4>
        <form onSubmit={(e)=>{
          SubmitHandler(e)
        }}>
          <div className="line absolute h-20 w-1 top-0 bg-clack"></div>
          <input type="text" placeholder='Add pick-up location ' className='bg-[#eee] px-12 py-2 text-lg rounded-lg w-full mt-5' />
          <input type="text" placeholder='Enter your destination' className='bg-[#eee] px-12 py-2 text-lg rounded-lg w-full mt-3' />
        </form></div>
        <div className="h-0 bg-red-500  ">

        </div>
      </div>
    </div>
  )
}

export default Home
