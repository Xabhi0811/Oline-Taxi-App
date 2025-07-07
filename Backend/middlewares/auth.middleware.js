const userModel = require('../models/user.model');
const jwt = require('jsonwebtoken');
const captainModel = require('../models/captain.module'); // ❗ You forgot to import this!
const blacklistTokenModel = require('../models/blacklistToken.model'); // ❗ You forgot to import this!

module.exports.authUser = async (req, res, next) => {
  try {
    // ✅ Proper token extraction
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Unauthorized access: No token provided' });
    }

    // ✅ Check if token is blacklisted
    const isBlacklisted = await blacklistTokenModel.findOne({ token });
    if (isBlacklisted) {
      return res.status(401).json({ message: 'Unauthorized access: Token is blacklisted' });
    }

    // ✅ Verify token
    const decoded = jwt.verify(token, process.env.jwt_SECRET);

    // ✅ Attach user to request
    const user = await userModel.findById(decoded._id).select('-Password');
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized access: User not found' });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error('Auth Middleware Error:', err.message);
    return res.status(401).json({ message: 'Unauthorized access: Invalid or expired token' });
  }
};

module.exports.authCaptain = async (req, res, next) => {
   const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
   if(!token){
    return res.status(401).json({message: 'Unauthorized'})
   }
   const isBlacklisted = await blacklistTokenModel.findOne({ token: token});
   if(isBlacklisted){
    return res.status(401).json({message: 'Unauthorized'})
   }

   try {
        const decoded = jwt.verify(token, process.env.jwt_SECRET);
        const captain = await captainModel.findById(decoded._id)
        res.captain = captain;
        next();
   } catch (err) {
    res.status(401).json({message: 'Unauthorized access: Invalid or expired token'});
   }
  }