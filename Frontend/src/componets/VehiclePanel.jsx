const vehicles = [
  { type: 'car', name: 'UberGo', description: 'Comfort for up to 4', icon: 'ri-taxi-line' },
  { type: 'bike', name: 'Moto', description: 'A quick ride for one', icon: 'ri-motorbike-line' },
  { type: 'auto', name: 'Auto', description: 'An everyday city ride', icon: 'ri-taxi-line' },
];
export default function VehiclePanel(props) {
  return <div>
    <button className="sheet-close" aria-label="Back to trip" onClick={() => props.setVehiclePanel(false)}>×</button>
    <h3 className="text-xl font-semibold">Choose a vehicle</h3>
    <p className="panel-subtitle">A ride that fits your plans.</p>
    {vehicles.map(vehicle => <button key={vehicle.type} className="vehicle-option" onClick={() => {
      props.selectVehicle(vehicle.type); props.setConfirmRidePanel(true);
    }}>
      <i className={vehicle.icon + ' text-4xl text-center'} aria-hidden="true"/>
      <div><h4>{vehicle.name}</h4><p>{vehicle.description}</p></div>
      <h2>{props.fare[vehicle.type]}</h2>
    </button>)}
  </div>;
}
