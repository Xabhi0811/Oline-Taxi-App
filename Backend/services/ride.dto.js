// Allow lists keep populated profiles and future schema fields out of ride payloads.
function name(person) {
  return { fullname: { firstname: person?.fullname?.firstname, lastname: person?.fullname?.lastname } };
}

function captainRide(ride) {
  return {
    _id: ride._id, pickup: ride.pickup, destination: ride.destination,
    fare: ride.fare, status: ride.status, vehicleType: ride.vehicleType,
    user: name(ride.user),
  };
}

function riderRide(ride) {
  const data = captainRide(ride);
  if (ride.captain?.vehicle) {
    const { color, plate, capacity, vehicleType } = ride.captain.vehicle;
    data.captain = { ...name(ride.captain), vehicle: { color, plate, capacity, vehicleType } };
  }
  if (['pending', 'accepted'].includes(ride.status) && ride.Otp) data.Otp = ride.Otp;
  return data;
}

function rideOffer(ride, user) {
  return { _id: ride._id, pickup: ride.pickup, destination: ride.destination, fare: ride.fare, user: name(user) };
}

module.exports = { captainRide, riderRide, rideOffer };
