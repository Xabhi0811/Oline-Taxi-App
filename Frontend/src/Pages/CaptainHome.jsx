import { useEffect , useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import CaptainDetails from '../componets/CaptainDetails'
import RidePopUp from '../componets/RidePopUp'
 import { useState } from 'react'
import ConfrimRidePopUp from '../componets/ConfirmRidePopUp'
import {SocketContext, CaptainDataContext} from '../context/contexts'




const CaptainHome = ( ) => {
  const navigate = useNavigate();

  const [ridePopUpPanel, setRidePopUpPanel] = useState(false);

  const [confirmRidePopUpPanel, setConfirmRidePopUpPanel] = useState(false);

  const {socket} = useContext(SocketContext)
  const {captain} = useContext(CaptainDataContext)
   // ride me data wla
   const [ride , setRide] = useState(null)
   const [rideError, setRideError] = useState('')

// Location belongs to the authenticated socket; the client does not choose an account ID.
useEffect(() => {
  if (!socket || !captain?._id || !navigator.geolocation) return;
  const sendLocation = position => {
    socket.emit('update-location-captain', {
      location: { lat: position.coords.latitude, lng: position.coords.longitude }
    });
  };
  const options = { enableHighAccuracy: true, timeout: 20000, maximumAge: 20000 };
  const locate = () => navigator.geolocation.getCurrentPosition(sendLocation, () => {}, options);
  const watchId = navigator.geolocation.watchPosition(sendLocation, () => {}, options);
  socket.on('ready', locate);
  return () => {
    navigator.geolocation.clearWatch(watchId);
    socket.off('ready', locate);
  };
}, [socket, captain?._id]);
useEffect(() => {
  if (!socket) return;

  const handleNewRide = (data) => {
    setRide(data);
    setRidePopUpPanel(true);
  };

  socket.on('new-ride', handleNewRide);
  let active = true;
  const recover = async () => {
    const id = sessionStorage.getItem('captainRideId');
    if (!id) return;
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/rides/captain/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('captainToken')}` }
      });
      if (!active) return;
      if (data.status === 'accepted') { setRide(data); setConfirmRidePopUpPanel(true); }
      else if (data.status === 'ongoing') navigate('/captain-riding', { state: { ride: data } });
      else { sessionStorage.removeItem('captainRideId'); setConfirmRidePopUpPanel(false); }
    } catch {
      if (active) setRideError('Unable to restore your ride. Please reconnect and try again.');
    }
  };
  socket.on('ready', recover);
  recover();

  return () => {
    active = false;
    socket.off('ready', recover);
    socket.off('new-ride', handleNewRide);
  };
}, [socket, navigate]);


 async function confirmRide() {
  setRideError('');
  try {
  const response = await axios.post(
    `${import.meta.env.VITE_BACKEND_URL}/rides/confirm`,
    {
      rideId: ride._id,
      captainId: captain._id
    },
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('captainToken')}`
      }
    }
  );

  setRidePopUpPanel(false);
  setConfirmRidePopUpPanel(true);
  setRide(response.data);
  sessionStorage.setItem('captainRideId', response.data._id);
  } catch (error) {
    setRideError(error.response?.data?.message || 'Unable to accept ride. Try again.');
  }
}




  return (
    <main className="trip-layout captain-layout">
      <header className="app-header">
        <Link to="/" className="brand">Uber <span className="brand-role">Captain</span></Link>
        <span className="header-caption">Ready for the road.</span>
        <Link to="/" className="header-link">Home</Link>
      </header>
      <div className="trip-map" aria-hidden="true">
        <img onError={e => { e.currentTarget.hidden = true; }} src="https://tse4.mm.bing.net/th/id/OIP.CLHyxk-5yNE9voIZWJ4h6gHaDH?rs=1&pid=ImgDetMain&o=7&rm=3" alt="" />
        <span className="map-caption">Your city. Your next trip.</span>
      </div>
      {!ridePopUpPanel && !confirmRidePopUpPanel && <section className="booking-card captain-card">
        <p className="eyebrow">CAPTAIN DASHBOARD</p>
        <CaptainDetails/>
        <p className="panel-subtitle mt-5">Ride requests will appear here when a nearby rider needs you.</p>
        {rideError && <p role="alert" className="mt-3 text-red-700">{rideError}</p>}
      </section>}
      {ridePopUpPanel && !confirmRidePopUpPanel && <section className="ride-sheet" aria-label="New ride">
        <RidePopUp ride={ride} setRidePopUpPanel={setRidePopUpPanel} setConfirmRidePopUpPanel={setConfirmRidePopUpPanel} ConfrimRide={confirmRide}/>
        {rideError && <p role="alert" className="mt-3 text-red-700">{rideError}</p>}
      </section>}
      {confirmRidePopUpPanel && <section className="ride-sheet" aria-label="Start ride">
        <ConfrimRidePopUp ride={ride} setConfirmRidePopUpPanel={setConfirmRidePopUpPanel}/>
      </section>}
    </main>
  );
};
export default CaptainHome;
