const router = require('express').Router();
const { body, query, param } = require('express-validator');
const controller = require('../controllers/ride.controller');
const auth = require('../models/middlewares/auth.middleware');

router.post('/create', auth.authUser,
  body('pickup').isString().trim().isLength({ min: 3 }),
  body('destination').isString().trim().isLength({ min: 3 }),
  body('vehicleType').isIn(['auto', 'car', 'bike']), controller.createRide);
router.get('/get-fare', auth.authUser,
  query('pickup').isString().trim().isLength({ min: 3 }),
  query('destination').isString().trim().isLength({ min: 3 }), controller.getFare);
router.post('/confirm', auth.authCaptain, body('rideId').isMongoId(), controller.confirmRide);
router.post('/start', auth.authCaptain,
  body('rideId').isMongoId(), body('otp').isString().matches(/^\d{6}$/), controller.startRide);
// Retain compatibility with existing clients.
router.get('/start-ride', auth.authCaptain,
  query('rideId').isMongoId(), query('otp').isString().matches(/^\d{6}$/), controller.startRide);
router.post('/end', auth.authCaptain, body('rideId').isMongoId(), controller.endRide);
router.get('/user/:rideId', auth.authUser, param('rideId').isMongoId(), controller.getRide);
router.get('/captain/:rideId', auth.authCaptain, param('rideId').isMongoId(), controller.getRide);
module.exports = router;
