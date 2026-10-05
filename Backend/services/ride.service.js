const Ride = require('../models/ride.module');
const crypto = require('crypto');
const { getFare } = require('./fare.util');

function conflict(message) {
  return Object.assign(new Error(message), { status: 409 });
}

module.exports.getFare = getFare;
module.exports.createRide = async ({ user, pickup, destination, vehicleType }) => {
  if (!user || !pickup || !destination || !['auto', 'car', 'bike'].includes(vehicleType)) {
    throw Object.assign(new Error('Valid ride details are required'), { status: 400 });
  }
  const fare = await getFare(pickup, destination);
  return Ride.create({
    user, pickup, destination, vehicleType,
    Otp: crypto.randomInt(100000, 1000000).toString(),
    fare: fare[vehicleType],
  });
};

module.exports.confirmRide = async ({ rideId, captain }) => {
  const ride = await Ride.findOneAndUpdate(
    { _id: rideId, status: 'pending' },
    { $set: { status: 'accepted', captain } },
    { new: true }
  ).populate('user').populate('captain').select('+Otp');
  if (!ride) throw conflict('Ride is unavailable or already accepted');
  return ride;
};

module.exports.startRide = async ({ rideId, otp, captain }) => {
  const ride = await Ride.findOneAndUpdate(
    { _id: rideId, captain: captain._id, status: 'accepted', Otp: String(otp) },
    { $set: { status: 'ongoing' } },
    { new: true }
  ).populate('user').populate('captain').select('+Otp');
  if (!ride) throw conflict('Ride, captain, or OTP is invalid');
  return ride;
};

module.exports.endRide = async ({ rideId, captain }) => {
  const ride = await Ride.findOneAndUpdate(
    { _id: rideId, captain: captain._id, status: 'ongoing' },
    { $set: { status: 'completed' } },
    { new: true }
  ).populate('user').populate('captain');
  if (!ride) throw conflict('Only the assigned captain can finish an ongoing ride');
  return ride;
};
