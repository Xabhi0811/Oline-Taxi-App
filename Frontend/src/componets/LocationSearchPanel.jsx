import React from 'react'

const LocationSearchPanel = (props) => {


 const locations =[
    '24B near DD nagar near amity university',
    '244a near DD nagar near amity university',  
    '245c near DD nagar near amity university',
    '24d3 near DD nagar near amity university',
    '254e near DD nagar near amity university',
    '24f near DD nagar near amity university', 

 ]

  return (
    <div>
         
         {
      locations.map(function(elem,idx){
        return (
      <div key={idx} onClick={()=>{
        props.setVehiclePanel(true)
        props.setPanelOpen(false)
      }}
       className="  gap-4 flex p-2 border-2 border-gray-50 active:border-black rounded-xl iteams-center my-2 justify-stat">
        <h2 className=' h-10 flex item-center justify-center w-10'><i className="ri-map-pin-fill  text-xl"></i></h2>
        <h4 className='font-medium'>{elem}</h4>
      </div>
        );
      })
         }







      
    </div>
  )
}

export default LocationSearchPanel
