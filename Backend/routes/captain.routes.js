 const captainController = require('../controllers/captain.controller');
const express = require('express');
 const router = express.Router();
 const {body} = require('express-validator');




 router.post('/register', [
    body('fullname.firstname').isLength({min: 3}).withMessage('First name must be at least 3 characters long'),
    body('fullname.lastname').optional().isLength({min: 3}).withMessage('Last name must be at least 3 characters long'),
    body('email').isEmail().withMessage('Please fill a valid email address'),
    body('password').isLength({min: 6}).withMessage('Password must be at least 6 characters long'),
    body('vehicle.color').isLength({min: 3}).withMessage('Color must be at least 3 characters long'),
    body('vehicle.plate').isLength({min: 3}).withMessage('Plate must be at least 3 characters long'),
    body('vehicle.capacity').isInt({gt: 0}).withMessage('Capacity must be at least 1'),
    body('vehicle.vehicleType').isIn(['car', 'bike', 'truck']).withMessage('Vehicle type must be car, bike, or truck')],

   captainController.registerCaptain

 )







 module.exports = router;