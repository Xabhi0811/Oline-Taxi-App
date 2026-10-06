export default function TripDetails({ pickup, destination, fare }) {
  return <dl className="trip-details">
    <div><dt>Pickup</dt><dd>{pickup}</dd></div>
    <div><dt>Destination</dt><dd>{destination}</dd></div>
    <div><dt>Fare · Cash</dt><dd>{fare}</dd></div>
  </dl>;
}
