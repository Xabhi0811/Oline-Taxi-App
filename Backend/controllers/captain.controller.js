const captainModel = require('../models/captain.module');
const captainService = require('../services/captain.service');
const { validationResult } = require('express-validator');
const blacklistTokenModel = require('../models/blacklistToken.model');




module.exports.registerCaptain = async (req, res) => {

    const errors = validationResult(req);
if (!errors.isEmpty()) {
  return res.status(400).json({ message: 'Please check the submitted details' });
}


     const error = validationResult(req);
     if (!error.isEmpty()) {
         return res.status(400).json({ message: 'Please check the submitted details' });
     }
     const { fullname, email, password, vehicle } = req.body;
     const isCaptainExists = await captainModel.findOne({ email});
     if (isCaptainExists) {
         return res.status(400).json({ message: 'Captain already exists' });
     }

     const hashPassword = await captainModel.hashPassword(password);
     const captain = await captainService.createCaptain({
    fullname: {
        firstname: fullname.firstname,
        lastname: fullname.lastname
    },
    email,
    password: hashPassword,
    vehicle: {
        color: vehicle.color,
        plate: vehicle.plate,
        capacity: vehicle.capacity,
        vehicleType: vehicle.vehicleType
    }
});


     const  token = captain.generateAuthToken();

     res.status(201).json({ token , captain});


}
module.exports.loginCaptain = async (req, res) => {

    const error = validationResult(req);
    if (!error.isEmpty()) {
        return res.status(400).json({ message: 'Please check the submitted details' });
    }

    const { email, password } = req.body;

    const captain = await captainModel.findOne({ email }).select('+password');

    if (!captain) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }


    const isMatch = await captain.comparePassword(password);

    if (!isMatch) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = captain.generateAuthToken();
    res.cookie('token', token);
    res.status(200).json({ token, captain });
};



module.exports.getCaptainProfile = async (req, res) => {
   res.status(200).json({captain: req.captain});
}


module.exports.logoutCaptain = async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1] || req.cookies.token;
  await blacklistTokenModel.updateOne({ token }, { $setOnInsert: { token } }, { upsert: true });

    res.clearCookie('token');
    res.status(200).json({ message: 'Logged out successfully' });
}
