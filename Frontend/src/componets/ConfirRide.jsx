import { useState } from 'react';

export default function ConfirRide(props) {
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  async function confirm() {
    setError('');
    setBusy(true);
    try {
      await props.createRide();
      props.setConfirmRidePanel(false);
      props.setVehicleFound(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to book your ride. Try again.');
    } finally { setBusy(false); }
  }
  return <section>
    <h2 className="text-2xl font-semibold">Confirm your ride</h2>
    <p className="mt-4">Pickup: {props.pickup}</p>
    <p className="mt-3">Destination: {props.destination}</p>
    <p className="mt-3 text-xl">Fare: {props.fare[props.vehicleType]}</p>
    <p>Payment: cash</p>
    {error && <p role="alert" className="mt-3 text-red-700">{error}</p>}
    <button disabled={busy} onClick={confirm} className="mt-5 w-full rounded-lg bg-green-700 p-3 text-white">{busy ? 'Booking...' : 'Confirm'}</button>
    <button disabled={busy} onClick={() => props.setConfirmRidePanel(false)} className="mt-3 w-full rounded-lg bg-gray-200 p-3">Back</button>
  </section>;
}
