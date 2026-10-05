import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function FinishRide({ ride, setFinishRidePanel }) {
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();
  async function finish() {
    setBusy(true);
    setError('');
    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/rides/end`, { rideId: ride._id }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('captainToken')}` }
      });
      sessionStorage.removeItem('captainRideId');
      navigate('/captain-home', { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to finish ride. Try again.');
    } finally {
      setBusy(false);
    }
  }
  return <section className="mx-auto max-w-lg">
    <h2 className="text-2xl font-semibold">Finish this ride</h2>
    <p className="mt-6">Destination: {ride.destination}</p>
    <p className="mt-2">Collect ₹{ride.fare} in cash.</p>
    {error && <p role="alert" className="mt-4 text-red-700">{error}</p>}
    <button onClick={finish} disabled={busy} className="mt-6 w-full rounded-lg bg-green-700 p-3 text-white">{busy ? 'Finishing...' : 'Finish Ride'}</button>
    <button onClick={() => setFinishRidePanel(false)} disabled={busy} className="mt-3 w-full rounded-lg bg-gray-200 p-3">Back</button>
  </section>;
}
