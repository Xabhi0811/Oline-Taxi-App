const rideModule = require('../models/ride.module');
const MapService = require('../services/map.service'); 
const crypto = require('crypto');  
const { getFare } = require('./fare.util');
const captainModel = require('../models/captain.module');
// adjust path

  // ✅ adjust path if needed


// Calculate fare for all vehicle types







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
       Otp: getOtp(6), // optional: you can store the type
        fare: fare[vehicleType]
    });

    return ride;
};


module.exports.confirmRide = async ({ rideId, captain }) => {
    if (!rideId) {
        throw new Error('Ride id is required');
    }

    await rideModule.findByIdAndUpdate(
        { _id: rideId },
        {
            status: 'accepted',
            captain: captain._id
        }
    );

    const ride = await rideModule.findOne({ _id: rideId }).populate('user');
    
    if (!ride) {
        throw new Error('Ride not found');
    }

    return ride;
};
