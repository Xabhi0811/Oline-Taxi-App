import { useState } from 'react';
import { Link } from 'react-router-dom';
import useRide from './useRide';
import FinishRide from '../componets/FinishRide';

const CaptainRiding = () => {
  const { ride, error } = useRide('captain');
  const [finishRidePanel, setFinishRidePanel] = useState(false);
  return <main className="ride-page">
    <Link to="/captain-home" className="underline">Captain home</Link>
    <section className="ride-summary">
      <h1 className="text-2xl font-semibold">Current ride</h1>
      {error && <p role="alert">{error}</p>}
      {!ride && !error && <p role="status">Loading ride...</p>}
      {ride && <>
        <p className="mt-4">Passenger: {ride.user?.fullname?.firstname} {ride.user?.fullname?.lastname}</p>
        <p className="mt-4">From: {ride.pickup}</p>
        <p>To: {ride.destination}</p>
        <p className="mt-4 text-xl">Fare: ₹{ride.fare}</p>
        {ride.status === 'ongoing' ? <button className="mt-6 w-full rounded-lg bg-green-700 p-3 text-white" onClick={() => setFinishRidePanel(true)}>Complete Ride</button> : <p role="status">Ride status: {ride.status}</p>}
      </>}
    </section>
    {finishRidePanel && <div className="finish-overlay"><FinishRide ride={ride} setFinishRidePanel={setFinishRidePanel}/></div>}
  </main>;
};
export default CaptainRiding;
