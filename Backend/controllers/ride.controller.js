 const rideService = require('../services/ride.service')
 const {validationResult} = require('express-validator')
 const mapService = require('../services/map.service')
 const {sendMessage} = require('../socket');
const rideModule = require('../models/ride.module');
 
module.exports.createRide = async (req, res) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res.status(400).json({ error: error.array() });
  }

  const { userId, pickup, destination, vehicleType } = req.body;

  try {
    const ride = await rideService.createRide({
      user: req.user._id,
      pickup,
      destination,
      vehicleType,
    });

    const pickupCoordinates = await mapService.getAddressCoordinates(pickup);
    const captainIdRadius = await mapService.getCaptainInTheRadius(
      pickupCoordinates.lat,
      pickupCoordinates.lng,
      5
    );

    ride.Otp = "";

    console.log("🧭 Nearby Captains Found:", captainIdRadius);


    const rideWithUser = await rideModule.findOne({_id: ride._id}).populate('user')

    captainIdRadius.map((captain) => {
      console.log(`📡 Emitting to captain: ${captain._id}, socketId: ${captain.socketId}`);
      sendMessage(captain.socketId, {
        event: "new-ride",
        data: rideWithUser,
      });
    });

    // ✅ Only send response once all async work is done
    return res.status(201).json(ride);
  } catch (err) {
    console.error("❌ Error in createRide:", err);
    return res.status(500).json({ message: err.message });
  }
};

 
module.exports.getFare =async (req, res) =>{
   
   const error = validationResult(req);
   if(!error.isEmpty())
   {
      return res.status(400).json({error: error.array()})
   }

   const {pickup , destination} = req.query
   try{
      const fare = await rideService.getFare(pickup , destination)
      return res.status(200).json(fare)
   }catch(err){
      return res.status(500).json({message: err.message})
   }

}


module.exports.confirmRide = async (req, res) =>{
   const error = validationResult(req)
   if(!error.isEmpty()){
      return res.status(400).json({error: error.array()})
   }
   const {rideId} = req.body
    
   try{
      const ride = await rideService.confirmRide(rideId , req.captain._id)


       sendMessage( ride.user.socketId,{
         event: "ride-confrim",
         data: ride 
       })



      return res.status(200).json(ride)
   }catch(err){
      return res.status(500).json({message: err.message})
   }

   
}