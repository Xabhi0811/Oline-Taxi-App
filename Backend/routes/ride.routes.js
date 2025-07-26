 const express = require ('express')
 const router = express.Router();
 const {body , query} = require('express-validator')
 const rideController = require ('../controllers/ride.controller')
 const authMiddleware = require('../middlewares/auth.middleware')



 router.post('/create',
   authMiddleware.authUser,
    body('pickup').isString().isLength({min: 3}).withMessage('Invaild pickup location'),
    body('destination').isString().isLength({min: 3}).withMessage('Invaild location of drop'),
    body('vehicleType').isString().isIn(['auto', 'car' , 'bike']).withMessage('Invalided vehicle'),
    rideController.createRide

 )




 router.get('/get-fare',
   authMiddleware.authUser,
   query('pickup').isString(),
   query('destination').isString(),
   rideController.getFare
  
  )

 module.exports = router;
