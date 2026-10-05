const userModel = require('../user.model');
const jwt = require('jsonwebtoken');
const captainModel = require('../captain.module');
const blacklistTokenModel = require('../blacklistToken.model');

module.exports.authUser = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1] || req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized access: No token provided' });
    }

    const isBlacklisted = await blacklistTokenModel.findOne({ token });
    if (isBlacklisted) {
      return res.status(401).json({ message: 'Unauthorized access: Token is blacklisted' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel.findById(decoded._id).select('-password');

    if (!user) {
      return res.status(401).json({ message: 'Unauthorized access: User not found' });
    }

    req.user = user;

    next();
  } catch (err) {
  
    return res.status(401).json({ message: 'Unauthorized access: Invalid or expired token' });
  }
};

module.exports.authCaptain = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1] || req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
  const isBlacklisted = await blacklistTokenModel.findOne({ token });
  if (isBlacklisted) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const captain = await captainModel.findById(decoded._id);

    if (!captain) {
      return res.status(401).json({ message: 'Unauthorized access: Captain not found' });
    }

    req.captain = captain; // ✅ FIXED
    next();
  } catch (err) {
    res.status(401).json({ message: 'Unauthorized access: Invalid or expired token' });
  }
};
