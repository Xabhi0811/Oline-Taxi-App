import TripDetails from './TripDetails';
export default function RidePopUp({ ride, setRidePopUpPanel, ConfrimRide }) {
  return <div>
    <button className="sheet-close" aria-label="Dismiss ride offer" onClick={() => setRidePopUpPanel(false)}>×</button>
    <p className="eyebrow">NEARBY REQUEST</p>
    <h2 className="text-2xl font-semibold">New ride available</h2>
    <p className="mt-5 rounded-xl bg-green-50 p-4 font-medium">{ride?.user?.fullname?.firstname} {ride?.user?.fullname?.lastname}</p>
    <TripDetails pickup={ride?.pickup} destination={ride?.destination} fare={'₹' + (ride?.fare ?? '')}/>
    <div className="grid grid-cols-2 gap-3 mt-5">
      <button onClick={ConfrimRide} className="rounded-xl bg-green-700 p-3 text-white font-semibold">Accept</button>
      <button onClick={() => setRidePopUpPanel(false)} className="rounded-xl bg-gray-100 p-3 font-semibold">Ignore</button>
    </div>
  </div>;
}
