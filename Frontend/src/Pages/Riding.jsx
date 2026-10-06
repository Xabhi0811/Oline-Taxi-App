import { useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { SocketContext } from '../context/contexts';
import useRide from './useRide';

const Riding = () => {
  const { ride, error, setRide } = useRide('user');
  const { socket } = useContext(SocketContext);
  useEffect(() => {
    if (!socket) return;
    const ended = data => {
      if (data._id === ride?._id) {
        setRide(data);
        sessionStorage.removeItem('userRideId');
      }
    };
    socket.on('ride-ended', ended);
    return () => socket.off('ride-ended', ended);
  }, [socket, ride?._id, setRide]);
  return <main className="ride-page">
    <Link to="/home" className="underline">Home</Link>
    <section className="ride-summary">
      <h1 className="text-2xl font-semibold">{ride?.status === 'completed' ? 'Ride completed' : 'Your ride'}</h1>
      {error && <p role="alert">{error}</p>}
      {!ride && !error && <p role="status">Loading ride...</p>}
      {ride && <>
        <p className="mt-4">Captain: {ride.captain?.fullname?.firstname} {ride.captain?.fullname?.lastname}</p>
        <p>Vehicle: {ride.captain?.vehicle?.plate}</p>
        <p className="mt-4">From: {ride.pickup}</p>
        <p>To: {ride.destination}</p>
        <p className="mt-4 text-xl">Fare: ₹{ride.fare}</p>
        <p>Payment: cash to your captain</p>
        <p role="status" className="mt-4">{ride.status === 'completed' ? 'You have arrived. Thank you for riding.' : 'Your captain will finish the ride when you arrive.'}</p>
      </>}
    </section>
  </main>;
};
export default Riding;
