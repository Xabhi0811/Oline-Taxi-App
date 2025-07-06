  const userModel = require('../models/user.model');
  const bcrypt = require('bcrypt');
  const jwt = require('jsonwebtoken');

  module.exports.authUser = async (req, res, next) => {
    const token = req.header = req.cookies.token || req.headers.authorization?.split(' ')[ 1 ];
     if(!token) {
      return res.status(401).json({ message: 'unauthorized access' });
  }

const isBlacklisted = await blacklistTokenModel.findOne({ token: token });
if (isBlacklisted) {
    return res.status(401).json({ message: 'unauthorized access' });
  }


  try{
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel.findById(decoded._id);
    
    req.user = user;

    return next();
  }
  catch(err)
    {
        return re.status(401).json({ message: 'unauthorized access' });
    }
}