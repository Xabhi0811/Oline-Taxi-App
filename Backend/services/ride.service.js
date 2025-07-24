const rideModule = require('../models/ride.module');
const MapService = require('../services/map.service'); // assuming you have this service

// Calculate fare for all vehicle types
async function getFare(pickup, destination) {
    if (!pickup || !destination) {
        throw new Error('Pickup and destination are required');
    }

    const distanceTime = await MapService.getDistanceTime(pickup, destination); // Make sure this returns { distance, time }
    
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

    const { distance, time } = distanceTime; // distance in km, time in minutes

    const fare = {
        auto: baseFare.auto + (distance * perKmRate.auto) + (time * perMinuteRate.auto),
        car: baseFare.car + (distance * perKmRate.car) + (time * perMinuteRate.car),
        bike: baseFare.bike + (distance * perKmRate.bike) + (time * perMinuteRate.bike)
    };

    return fare;
}
  function getOtp(num){
function generateOtp(num){
    const otp = crypto.randomInt(Math.pow(10, num-1), Math.pow(10,num)).toString();
    return otp;
}
return generateOtp(num)}



















// Create a ride
module.exports.createRide = async ({
    user, pickup, destination, vehicleType
}) => {
    if (!user || !pickup || !destination || !vehicleType) {
        throw new Error('All fields are required');
    }

    const fare = await getFare(pickup, destination); // ✅ added missing `await`

    const ride = await rideModule.create({ // ✅ added `await`
        user,
        pickup,
        destination,
        vehicleType: vehicleType,
        Otp: getOtp(6),// optional: you can store the type
        fare: fare[vehicleType]
    });

    return ride;
};
