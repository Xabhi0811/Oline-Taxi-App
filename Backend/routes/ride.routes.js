 const express = require ('express')
 const router = express.Router();
 const {body , query} = require('express-validator')
 const rideController = require ('../controllers/ride.controller')
 const authMiddleware = require('../models/middlewares/auth.middleware')
const { getFare } = require('../services/fare.util');
//const { authCaptain } = require('../middleware/auth.middleware');




 router.post('/create',
   authMiddleware.authUser,
    body('pickup').isString().isLength({min: 3}).withMessage('Invaild pickup location'),
    body('destination').isString().isLength({min: 3}).withMessage('Invaild location of drop'),
    body('vehicleType').isString().isIn(['auto', 'car' , 'bike']).withMessage('Invalided vehicle'),
    rideController.createRide

 )


router.get('/get-fare', authMiddleware.authUser, async (req, res) => {
  try {
    const { pickup, destination } = req.query;
    console.log("Pickup:", pickup);
    console.log("Destination:", destination);

    if (!pickup || !destination) {
      return res.status(400).json({ message: "Pickup and destination are required" });
    }

    const fare = await getFare(pickup, destination);
    res.json({ fare });

  } catch (error) {
    console.error("💥 Fare route error:", error.message);
    res.status(500).json({ message: 'Failed to calculate fare', error: error.message });
  }
});


  router.post(
  '/confirm',
  authMiddleware.authCaptain,
  body('rideId').isMongoId().withMessage('Invalid rideId'),
  rideController.confirmRide
);






router.get('/start-ride',
  authMiddleware.authCaptain,
  query('rideId').isMongoId().withMessage('invaild ride /start-ride ride id'),
  query('otp').isString().isLength({min: 6 , max: 6}).withMessage('ivaild otp hai'),
  rideController.startRide
)






 module.exports = router;
