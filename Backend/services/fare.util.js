
  const rideModule = require('../models/ride.module');
const MapService = require('../services/map.service'); 
  
  module.exports.getFare = async function getFare(pickup, destination) {
  console.log("🚗 getFare called with:", pickup, destination);

  if (!pickup || !destination) {
    throw new Error('Pickup and destination are required');
  }

  const distanceTime = await MapService.getDistanceTime(pickup, destination);

  // ✅ If route could not be found
  if (!distanceTime) {
    throw new Error("No route found between pickup and destination.");
  }

  console.log("📏 distanceTime:", distanceTime);

  const baseFare = {
    auto: 20,
    car: 50,
    bike: 10
  };

  const perKmRate = {
    auto: 10,
    car: 20,
    bike: 5
  };

  const perMinuteRate = {
    auto: 1,
    car: 2,
    bike: 0.5
  };

  const fare = {
    auto: baseFare.auto + Math.round((distanceTime.distance.value / 1000) * perKmRate.auto) + ((distanceTime.duration.value / 60) * perMinuteRate.auto),
    car: baseFare.car + Math.round((distanceTime.distance.value / 1000) * perKmRate.car) + ((distanceTime.duration.value / 60) * perMinuteRate.car),
    bike: baseFare.bike + Math.round((distanceTime.distance.value / 1000) * perKmRate.bike) + ((distanceTime.duration.value / 60) * perMinuteRate.bike),
  };

  console.log("💰 Fare calculated:", fare);
  return fare;
};

