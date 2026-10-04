const rideModule = require('../models/ride.module');
const MapService = require('../services/map.service'); 
const crypto = require('crypto');  
const { getFare } = require('./fare.util');
const captainModel = require('../models/captain.module');
const { sendMessage } = require('../socket');
// adjust path

  // ✅ adjust path if needed


// Calculate fare for all vehicle types







  function getOtp(num) {
    const otp = crypto.randomInt(Math.pow(10, num - 1), Math.pow(10, num)).toString();
    return otp;
  }



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


module.exports.confirmRide = async ({ rideId, captain  }) => {
    if (!rideId) {
        throw new Error('Ride id is required');
    }

    const ride = await rideModule.findOneAndUpdate(
        { _id: rideId, status: 'pending' },
        { $set: { status: 'accepted', captain } },
        { new: true }
    ).populate('user').populate('captain').select('+Otp');
    
    if (!ride) {
        throw new Error('Ride is unavailable or already accepted');
    }

    return ride;
};



module.exports.startRide = async ({rideId , otp , captain}) =>{
    if(!rideId || !otp){
        throw new Error('Ride id aur uski otp chaiye')
    }

    const ride = await rideModule.findOneAndUpdate({
        _id: rideId,
        captain: captain._id,
        status: 'accepted',
        Otp: otp.toString(),
    }, {
        $set: { status: 'ongoing' }
    }, { new: true }).populate('user').populate('captain').select('+Otp');


    if(!ride){
        throw new Error('Ride, captain, or OTP is invalid');
    }

    return ride;
}
