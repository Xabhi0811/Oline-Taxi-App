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

    await rideModule.findByIdAndUpdate(
        { _id: rideId },
        {
            status: 'accepted',
            captain: captain._id
        } 
    );

    const ride = await rideModule.findOne({ _id: rideId }).populate('user').populate('captain').select('+Otp')
    
    if (!ride) {
        throw new Error('Ride not found');
    }

    return ride;
};



module.exports.startRide = async ({rideId , otp , captain}) =>{
    if(!rideId || !otp){
        throw new Error('Ride id aur uski otp chaiye')
    }

    const ride = await rideModule.findOne({
        _id: rideId
    }).populate('user').populate('captain').select('+Otp')


    if(!ride){
        throw new Error(' ride idhar nhi hai')
    }

    if(ride.status !== 'accepted'){
        throw new Error('ride not mai nhi le rha ')
    }

    if(ride.Otp !== otp.toString()){
     throw  new Error ('opt galat hai')
    }

    await rideModule.findOneAndUpdate({
        _id: rideId
    },{
        status : "ongoing "
    })

    sendMessage(ride.user.socketId,{
        event: 'ride-started',
        data: ride 
    })

}