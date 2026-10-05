import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function ConfirmRidePopUp({ ride, setConfirmRidePopUpPanel }) {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();
  async function submit(event) {
    event.preventDefault();
    setError('');
    setBusy(true);
    try {
      const { data } = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/rides/start`, { rideId: ride._id, otp }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('captainToken')}` }
      });
      sessionStorage.setItem('captainRideId', data._id);
      setConfirmRidePopUpPanel(false);
      navigate('/captain-riding', { state: { ride: data } });
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to start ride. Try again.');
    } finally { setBusy(false); }
  }
  return <section>
    <h2 className="text-2xl font-semibold">Confirm ride</h2>
    <p className="mt-4">Passenger: {ride?.user?.fullname?.firstname} {ride?.user?.fullname?.lastname}</p>
    <p>Pickup: {ride?.pickup}</p>
    <p>Destination: {ride?.destination}</p>
    <p>Fare: ₹{ride?.fare}</p>
    <form onSubmit={submit} className="mt-6">
      <label htmlFor="ride-otp">Ask the passenger for their six-digit OTP</label>
      <input id="ride-otp" value={otp} onChange={e => setOtp(e.target.value)} required pattern="[0-9]{6}" inputMode="numeric" maxLength={6} placeholder="Enter OTP" className="mt-3 w-full rounded-lg bg-gray-100 p-4"/>
      {error && <p role="alert" className="mt-3 text-red-700">{error}</p>}
      <button disabled={busy || !ride} className="mt-4 w-full rounded-lg bg-green-700 p-4 text-white">{busy ? 'Starting...' : 'Start Ride'}</button>
    </form>
  </section>;
}
