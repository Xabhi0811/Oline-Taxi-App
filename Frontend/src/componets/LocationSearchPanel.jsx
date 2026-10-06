export default function LocationSearchPanel({ locations = [], onSelectLocation }) {
  return <div>
    {locations.map((location, index) => <button type="button" key={location.place_id || index} className="location-option"
      onClick={() => onSelectLocation?.(location.description)}>
      <i className="ri-map-pin-fill" aria-hidden="true"/><span>{location.description}</span>
    </button>)}
  </div>;
}
