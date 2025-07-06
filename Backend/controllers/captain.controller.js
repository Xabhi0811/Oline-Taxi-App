const captainModel = require('../models/captain.module');
const captainService = require('../services/captain.service');
const { validationResult } = require('express-validator');



module.exports.registerCaptain = async (req, res) => {

     const error = validationResult(req);
     if (!error.isEmpty()) {
         return res.status(400).json({ errors: error.array() });
     }
     const { fullname, email, password, vehicle } = req.body;
     const isCaptainExists = await captainModel.findOne({ email});
     if (isCaptainExists) {
         return res.status(400).json({ message: 'Captain already exists' });
     }

     const hashPassword = await captainModel.hashPassword(password);

     const captain = await captainService.createCaptain({
         firstname: fullname.firstname,
         lastname: fullname.lastname,
         email,
         password: hashPassword,
         color: vehicle.color,
         plate: vehicle.plate,
         capacity: vehicle.capacity,
         vehicleType: vehicle.vehicleType
     });

     const  token = captain.generateAuthToken();

     res.status(201).json({ token , captain});


}