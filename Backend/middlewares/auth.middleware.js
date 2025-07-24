const userModel = require('../models/user.model');
const jwt = require('jsonwebtoken');
const captainModel = require('../models/captain.module');
const blacklistTokenModel = require('../models/blacklistToken.model');

module.exports.authUser = async (req, res, next) => {
  try {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized access: No token provided' });
    }

    const isBlacklisted = await blacklistTokenModel.findOne({ token });
    if (isBlacklisted) {
      return res.status(401).json({ message: 'Unauthorized access: Token is blacklisted' });
    }

    const decoded = jwt.verify(token, process.env.jwt_SECRET);
    const user = await userModel.findById(decoded._id).select('-Password');

    if (!user) {
      return res.status(401).json({ message: 'Unauthorized access: User not found' });
    }

    req.user = user;
    console.log('✅ Authenticated User:', req.user);

    next();
  } catch (err) {
  
    return res.status(401).json({ message: 'Unauthorized access: Invalid or expired token' });
  }
};

module.exports.authCaptain = async (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const isBlacklisted = await blacklistTokenModel.findOne({ token });
  if (isBlacklisted) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, process.env.jwt_SECRET);
    const captain = await captainModel.findById(decoded._id);

    if (!captain) {
      return res.status(401).json({ message: 'Unauthorized access: Captain not found' });
    }

    req.captain = captain; // ✅ FIXED
    next();
  } catch (err) {
    console.error(err); // Optional: log for debugging
    res.status(401).json({ message: 'Unauthorized access: Invalid or expired token' });
  }
};
