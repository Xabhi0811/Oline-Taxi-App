 const rideService = require('../services/ride.service')
 const {validationResult} = require('express-validator')
 const mapService = require('../services/map.service')
 const {sendMessageToSocketId} = require('../socket')

 module.exports.createRide = async (req , res) =>{
    const error = validationResult(req)
     if(!error.isEmpty()){
        return res.status(400).json({error: error.array()})
     }
     const {userId ,pickup , destination , vehicleType} = req.body

     try{
       const ride = await rideService.createRide({user: req.user._id, pickup , destination , vehicleType})
           res.status(201).json(ride)
      
       const pickupCoordinates = await mapService.getAddressCoordinates(pickup)
    
       const captainIdRadius = await mapService.getCaptainInTheRadius(  pickupCoordinates.lat,  pickupCoordinates.lng, 2 );
         
       ride.Otp =""

       captainIdRadius.map(captain =>{

         sendMessageToSocketId(captain.socketId,{
            event: 'new-ride',
            data: ride,
         })
       })



    
     }catch(err){
      return res.status(500).json({message: err.message})
     }
    

 }

 
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