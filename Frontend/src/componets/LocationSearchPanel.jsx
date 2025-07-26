import React from 'react'

const LocationSearchPanel = (props) => {
  const { locations = [], onSelectLocation } = props;

  return (
    <div>
      {locations.map((elem, idx) => (
        <div
          key={idx}
          onClick={() => {
            if (onSelectLocation) onSelectLocation(elem.description); // Use description when selecting
          }}
          className="gap-4 flex p-2 border-2 border-gray-50 active:border-black rounded-xl items-center my-2 justify-start"
        >
          <h2 className='h-10 flex items-center justify-center w-10'>
            <i className="ri-map-pin-fill text-xl"></i>
          </h2>
          <h4 className='font-medium'>{elem.description}</h4> {/* FIXED */}
        </div>
      ))}
    </div>
  );
}

export default LocationSearchPanel;
