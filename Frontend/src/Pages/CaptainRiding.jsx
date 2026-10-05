import { useState } from 'react';
import { Link } from 'react-router-dom';
import useRide from './useRide';
import FinishRide from '../componets/FinishRide';

const CaptainRiding = () => {
  const { ride, error } = useRide('captain');
  const [finishRidePanel, setFinishRidePanel] = useState(false);
  return <main className="min-h-screen bg-gray-100 p-6">
    <Link to="/captain-home" className="underline">Captain home</Link>
    <section className="mx-auto mt-12 max-w-lg rounded-xl bg-white p-6">
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
    {finishRidePanel && <div className="fixed inset-0 overflow-auto bg-white p-6"><FinishRide ride={ride} setFinishRidePanel={setFinishRidePanel}/></div>}
  </main>;
};
export default CaptainRiding;
