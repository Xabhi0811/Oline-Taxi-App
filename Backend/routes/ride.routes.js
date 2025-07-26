 const express = require ('express')
 const router = express.Router();
 const {body , query} = require('express-validator')
 const rideController = require ('../controllers/ride.controller')
 const authMiddleware = require('../middlewares/auth.middleware')
 const MapService = require('../services/map.service'); // ✅ FIXED




 router.post('/create',
   authMiddleware.authUser,
    body('pickup').isString().isLength({min: 3}).withMessage('Invaild pickup location'),
    body('destination').isString().isLength({min: 3}).withMessage('Invaild location of drop'),
    body('vehicleType').isString().isIn(['auto', 'car' , 'bike']).withMessage('Invalided vehicle'),
    rideController.createRide

 )


 function calculateFare(distanceInMeters) {
  const baseFare = 30; // starting fare in ₹
  const perKmRate = 10; // ₹ per km

  const distanceInKm = distanceInMeters / 1000;
  const totalFare = baseFare + (distanceInKm * perKmRate);

  return Math.round(totalFare); // round to nearest ₹
}




router.get('/get-fare', async (req, res) => {
  try {
    const { pickup, destination } = req.query;
    console.log("Pickup:", pickup);
    console.log("Destination:", destination);

    if (!pickup || !destination) {
      return res.status(400).json({ message: "Pickup and destination are required" });
    }

    const distanceTime = await MapService.getDistanceTime(pickup, destination);
    console.log("DistanceTime:", distanceTime);

    const fare = calculateFare(distanceTime.distance.value);

    res.json({
      distance: distanceTime.distance,
      duration: distanceTime.duration,
      fare
    });

  } catch (error) {
    console.error("💥 Fare route error:", error.message);
    res.status(500).json({ message: 'Failed to calculate fare', error: error.message });
  }
});

 module.exports = router;
