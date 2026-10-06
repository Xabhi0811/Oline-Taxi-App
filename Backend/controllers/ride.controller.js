const rideService = require('../services/ride.service');
const { validationResult } = require('express-validator');
const mapService = require('../services/map.service');
const { sendMessage } = require('../socket');
const { captainRide, riderRide, rideOffer } = require('../services/ride.dto');

function invalid(req, res) {
  const errors = validationResult(req);
  if (errors.isEmpty()) return false;
  res.status(400).json({ message: 'Please check the submitted details' });
  return true;
}

module.exports.createRide = async (req, res) => {
  if (invalid(req, res)) return;
  const { pickup, destination, vehicleType } = req.body;
  try {
    const coordinates = await mapService.getAddressCoordinates(pickup);
    if (!coordinates) return res.status(422).json({ message: 'Pickup location could not be found' });
    const captains = await mapService.getCaptainInTheRadius(coordinates.lat, coordinates.lng, 5);
    const eligible = captains.filter(c => c.vehicle.vehicleType === vehicleType && c.socketId);
    const ride = await rideService.createRide({ user: req.user._id, pickup, destination, vehicleType,
      offeredCaptains: eligible.map(c => c._id) });
    const data = rideOffer(ride, req.user);
    eligible.forEach(c => {
      sendMessage(c.socketId, { event: 'new-ride', data });
    });
    return res.status(201).json(riderRide(ride));
  } catch (error) {
    return res.status(error.status || 502).json({ message: 'Unable to create ride. Check the locations and try again.' });
  }
};

module.exports.getFare = async (req, res) => {
  if (invalid(req, res)) return;
  try {
    const fare = await rideService.getFare(req.query.pickup, req.query.destination);
    res.json({ fare });
  } catch {
    res.status(502).json({ message: 'Unable to calculate fare. Check the locations and try again.' });
  }
};

module.exports.confirmRide = async (req, res) => {
  if (invalid(req, res)) return;
  try {
    const ride = await rideService.confirmRide({ rideId: req.body.rideId, captain: req.captain });
    sendMessage(ride.user.socketID, { event: 'ride-confirmed', data: riderRide(ride) });
    res.json(captainRide(ride));
  } catch (error) {
    res.status(error.status || 500).json({ message: error.status ? error.message : 'Unable to accept ride' });
  }
};

module.exports.startRide = async (req, res) => {
  if (invalid(req, res)) return;
  try {
    const { rideId, otp } = req.body;
    const ride = await rideService.startRide({ rideId, otp, captain: req.captain });
    sendMessage(ride.user.socketID, { event: 'ride-started', data: riderRide(ride) });
    res.json(captainRide(ride));
  } catch (error) {
    res.status(error.status || 500).json({ message: error.status ? error.message : 'Unable to start ride' });
  }
};

module.exports.endRide = async (req, res) => {
  if (invalid(req, res)) return;
  try {
    const ride = await rideService.endRide({ rideId: req.body.rideId, captain: req.captain });
    sendMessage(ride.user.socketID, { event: 'ride-ended', data: riderRide(ride) });
    res.json(captainRide(ride));
  } catch (error) {
    res.status(error.status || 500).json({ message: error.status ? error.message : 'Unable to finish ride' });
  }
};

module.exports.getRide = async (req, res) => {
  if (invalid(req, res)) return;
  const Ride = require('../models/ride.module');
  const filter = { _id: req.params.rideId };
  if (req.user) filter.user = req.user._id;
  else filter.captain = req.captain._id;
  const query = Ride.findOne(filter).populate('user', 'fullname socketID').populate('captain', 'fullname vehicle');
  if (req.user) query.select('+Otp');
  const ride = await query;
  if (!ride) return res.status(404).json({ message: 'Ride not found' });
  res.json(req.user ? riderRide(ride) : captainRide(ride));
};
