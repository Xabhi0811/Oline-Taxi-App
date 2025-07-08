const captainModel = require('../models/captain.module');
const captainService = require('../services/captain.service');
const { validationResult } = require('express-validator');
const blacklistTokenModel = require('../models/blacklistToken.model');




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
    console.log("✅ captain login route hit");
    
    const error = validationResult(req);
    if (!error.isEmpty()) {
        return res.status(400).json({ errors: error.array() });
    }

    const { email, password } = req.body;
    console.log("📩 Login attempt for:", email);

    const captain = await captainModel.findOne({ email }).select('+password');

    if (!captain) {
        console.log("❌ Captain not found");
        return res.status(401).json({ message: 'Invalid email or password' });
    }

    console.log("🔐 Found captain. Checking password...");

    const isMatch = await captain.comparePassword(password);

    if (!isMatch) {
        console.log("❌ Password mismatch");
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
  const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
  await blacklistTokenModel.create({ token });

    res.clearCookie('token');
    res.status(200).json({ message: 'Logged out successfully' });
}