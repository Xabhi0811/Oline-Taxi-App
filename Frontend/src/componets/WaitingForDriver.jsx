import TripDetails from './TripDetails';
export default function WaitingForDriver({ ride, setWaitingForDriver }) {
  return <div>
    <button className="sheet-close" aria-label="Close captain details" onClick={() => setWaitingForDriver(false)}>×</button>
    <p className="eyebrow">YOUR CAPTAIN IS ON THE WAY</p>
    <h2 className="text-2xl font-semibold capitalize">{ride?.captain?.fullname?.firstname} {ride?.captain?.fullname?.lastname}</h2>
    <p className="panel-subtitle">{ride?.captain?.vehicle?.plate} · {ride?.captain?.vehicle?.color}</p>
    <div className="my-5 rounded-xl bg-green-50 p-4">
      <h1 className="text-xl font-semibold tracking-wider">OTP: {ride?.Otp}</h1>
      <p className="text-sm text-gray-600 mt-1">Share this code with your captain at pickup.</p>
    </div>
    <TripDetails pickup={ride?.pickup} destination={ride?.destination} fare={'₹' + (ride?.fare ?? '')}/>
  </div>;
}
