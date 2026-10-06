import TripDetails from './TripDetails';
export default function LookingForDriver(props) {
  return <div>
    <button className="sheet-close" aria-label="Close driver search" onClick={() => props.setVehicleFound(false)}>×</button>
    <p className="eyebrow">YOUR RIDE</p>
    <h2 className="text-2xl font-semibold">Looking for a driver</h2>
    <p className="panel-subtitle" role="status">We'll let you know when a captain accepts.</p>
    <div className="text-center text-6xl text-green-800 py-5" aria-hidden="true"><i className="ri-taxi-line"/></div>
    <TripDetails pickup={props.pickup} destination={props.destination} fare={props.fare[props.vehicleType]}/>
  </div>;
}
