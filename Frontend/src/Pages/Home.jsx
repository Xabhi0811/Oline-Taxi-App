import { useContext, useEffect } from 'react'
import { useState } from 'react'
import 'remixicon/fonts/remixicon.css'
import LocationSearchPanel from '../componets/LocationSearchPanel';
import VehiclePanel from '../componets/VehiclePanel';
import ConfirRide from '../componets/ConfirRide';
import LookingForDriver from '../componets/LookingForDriver';
import WaitingForDriver from '../componets/WaitingForDriver';
import axios from 'axios'
import { SocketContext } from '../context/contexts';
import { Link, useNavigate } from 'react-router-dom';


const Home = () => {
    const [pickup , setPickup ] = useState('')
    const [destination , setDestination ] = useState('')
    const [panelOpen , setPanelOpen ] = useState(false)
  const [vehiclePanel , setVehiclePanel] = useState(false)
  const [confirmRidePanel , setConfirmRidePanel] = useState(false)
  const [vehicleFound, setVehicleFound] = useState(false)
  const [waitingForDriver , setWaitingForDriver] = useState(false)
  // New state for suggestions and active field
  const [locationSuggestions, setLocationSuggestions] = useState([])
  const [suggestionStatus, setSuggestionStatus] = useState('idle')
  const [suggestionError, setSuggestionError] = useState('')
  const [activeField, setActiveField] = useState(null) // 'pickup' or 'destination'
  const [fare , setFare] = useState({})
  const [vehicleType , setVehicleType] = useState(null)
  const [ ride , setRide] = useState(null)
  const [tripError, setTripError] = useState('')
  const [findingTrip, setFindingTrip] = useState(false)

  const navigate = useNavigate()


  const {socket} = useContext(SocketContext)








useEffect(() => {
  if (!socket) return;

  const handleRideConfirm = (ride) => {
    sessionStorage.setItem('userRideId', ride._id);
    setVehicleFound(false);
    setWaitingForDriver(true);
    setRide(ride);
  };

  const handleRideStarted = (ride) => {
    setWaitingForDriver(false);
    sessionStorage.setItem('userRideId', ride._id);
    navigate('/riding', { state: { ride } });
  };

  socket.on('ride-confirmed', handleRideConfirm);
  socket.on('ride-started', handleRideStarted);
  let active = true;
  const recover = async () => {
    const id = sessionStorage.getItem('userRideId');
    if (!id) return;
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/rides/user/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      if (!active) return;
      if (data.status === 'accepted') handleRideConfirm(data);
      else if (data.status === 'ongoing') handleRideStarted(data);
      else if (data.status === 'pending') { setRide(data); setVehicleFound(true); }
      else { sessionStorage.removeItem('userRideId'); setWaitingForDriver(false); setVehicleFound(false); }
    } catch {
      if (active) setTripError('Unable to restore your ride. Please reconnect and try again.');
    }
  };
  socket.on('ready', recover);
  recover();

  return () => {
    active = false;
    socket.off('ready', recover);
    socket.off('ride-confirmed', handleRideConfirm);
    socket.off('ride-started', handleRideStarted);
  };
}, [socket, navigate]);



  // Cancel obsolete searches when typing, switching fields or closing the panel.
  useEffect(() => {
    const input = (activeField === 'pickup' ? pickup : activeField === 'destination' ? destination : '').trim();
    setLocationSuggestions([]);
    setSuggestionError('');
    if (!panelOpen || input.length < 2) {
      setSuggestionStatus('idle');
      return;
    }
    const controller = new AbortController();
    let active = true;
    setSuggestionStatus('loading');
    const timer = setTimeout(async () => {
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/map/get-suggestions`, {
          params: { input },
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          signal: controller.signal,
        });
        if (!active) return;
        const suggestions = Array.isArray(data.suggestions) ? data.suggestions : [];
        setLocationSuggestions(suggestions);
        setSuggestionStatus(suggestions.length ? 'ready' : 'empty');
      } catch (error) {
        if (!active || axios.isCancel(error)) return;
        setSuggestionStatus('error');
        setSuggestionError(error.response?.status === 401 ? 'Your session has expired. Please log in again.'
          : error.response?.status === 429 ? 'Too many searches. Please wait a moment and try again.'
          : error.response?.data?.message || 'Unable to load locations. Check your connection and try again.');
      }
    }, 300);
    return () => {
      active = false;
      clearTimeout(timer);
      controller.abort();
    };
  }, [pickup, destination, panelOpen, activeField]);

  const handleInputClick = (field) => {
    setPanelOpen(true);
    setActiveField(field);
  };

  const handleSelectLocation = (location) => {
    if (activeField === 'pickup') {
      setPickup(location);
    } else if (activeField === 'destination') {
      setDestination(location);
    }
    setPanelOpen(false);
    setActiveField(null);
    setLocationSuggestions([]);
  };

async function findTrip() {
  setTripError('');
  if (pickup.trim().length < 3 || destination.trim().length < 3) {
    setTripError('Enter a pickup and destination of at least three characters.');
    return;
  }
  setFindingTrip(true);

  try {
    const response = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/rides/get-fare`,
      {
        params: {
          pickup: pickup,
          destination: destination
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }
    );

    const calculatedFare = response.data.fare;

    const fareData = {
      car: `₹${Math.ceil(calculatedFare.car)}`,
      bike: `₹${Math.ceil(calculatedFare.bike)}`,
      auto: `₹${Math.ceil(calculatedFare.auto)}`
    };

    setFare(fareData);
    setVehiclePanel(true);
    setPanelOpen(false);
  } catch (error) {
    setTripError(error.response?.data?.message || 'Unable to find a trip. Try again.');
  } finally {
    setFindingTrip(false);
  }
}

async function createRide() {
  const response = await axios.post(
    `${import.meta.env.VITE_BACKEND_URL}/rides/create`,
    {
      pickup,
      destination,
      vehicleType
    },
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    }
  );
  setRide(response.data);
  sessionStorage.setItem('userRideId', response.data._id);
  return response.data;
}








  const activePanel = waitingForDriver ? 'waiting' : vehicleFound ? 'searching' : confirmRidePanel ? 'confirm' : vehiclePanel ? 'vehicle' : null;
  return (
    <main className="trip-layout">
      <header className="app-header">
        <Link to="/" className="brand">Uber</Link>
        <span className="header-caption">Your next ride, made simple.</span>
        <Link to="/users/logout" className="header-link">Log out</Link>
      </header>
      <div className="trip-map" aria-hidden="true">
        <img onError={e => { e.currentTarget.hidden = true; }} src="https://tse4.mm.bing.net/th/id/OIP.CLHyxk-5yNE9voIZWJ4h6gHaDH?rs=1&pid=ImgDetMain&o=7&rm=3" alt="" />
        <span className="map-caption">Let's get you there.</span>
      </div>
      {!activePanel && <section className="booking-card" aria-label="Plan your trip">
        <p className="eyebrow">ON YOUR SCHEDULE</p>
        <h1 className="panel-title">Where to?</h1>
        <p className="panel-subtitle">Choose your pickup and destination.</p>
        <form onSubmit={e => { e.preventDefault(); findTrip(); }} className="trip-form">
          <label htmlFor="pickup">Pickup</label>
          <input id="pickup" onFocus={() => handleInputClick('pickup')} value={pickup} onChange={e => setPickup(e.target.value)}
            placeholder="Add pick-up location" autoComplete="off" maxLength={300} />
          <label htmlFor="destination">Destination</label>
          <input id="destination" onFocus={() => handleInputClick('destination')} value={destination} onChange={e => setDestination(e.target.value)}
            placeholder="Enter your destination" autoComplete="off" maxLength={300} />
          <button disabled={findingTrip} className="primary-button">{findingTrip ? 'Finding trip...' : 'Find Trip'}</button>
        </form>
        {tripError && <p role="alert" className="mt-3 text-sm text-red-700">{tripError}</p>}
        {panelOpen && <div className="suggestion-list">
          <div className="suggestion-heading"><span>Suggested locations</span>
            <button type="button" onClick={() => setPanelOpen(false)} aria-label="Close suggestions"><i className="ri-close-line" aria-hidden="true"/></button></div>
          {suggestionStatus === 'loading' && <p role="status" className="text-sm text-gray-500 py-3">Searching locations...</p>}
          {suggestionStatus === 'idle' && <p className="text-sm text-gray-500 py-3">Type at least two characters to search.</p>}
          {suggestionStatus === 'empty' && <p role="status" className="text-sm text-gray-500 py-3">No locations found. Try adding your city or a nearby landmark.</p>}
          {suggestionStatus === 'error' && <p role="alert" className="text-sm text-red-700 py-3">{suggestionError}</p>}
          <LocationSearchPanel locations={locationSuggestions} onSelectLocation={handleSelectLocation}/>
          {suggestionStatus === 'ready' && <img className="mt-3 h-[18px] w-auto" src="https://maps.gstatic.com/mapfiles/api-3/images/powered-by-google-on-white3.png" alt="Powered by Google"/>}
        </div>}
      </section>}
      {activePanel && <section className="ride-sheet" aria-label="Ride details">
        {activePanel === 'vehicle' && <VehiclePanel selectVehicle={setVehicleType} fare={fare} setConfirmRidePanel={setConfirmRidePanel} setVehiclePanel={setVehiclePanel}/>}
        {activePanel === 'confirm' && <ConfirRide pickup={pickup} destination={destination} fare={fare} vehicleType={vehicleType}
          createRide={createRide} setConfirmRidePanel={setConfirmRidePanel} setVehicleFound={setVehicleFound}/>}
        {activePanel === 'searching' && <LookingForDriver pickup={pickup} destination={destination} fare={fare} vehicleType={vehicleType} setVehicleFound={setVehicleFound}/>}
        {activePanel === 'waiting' && <WaitingForDriver ride={ride} setVehicleFound={setVehicleFound} setWaitingForDriver={setWaitingForDriver} waitingForDriver={waitingForDriver}/>}
      </section>}
    </main>
  );
};
export default Home;
