const userModel = require('../models/user.model');
const userservice = require('../services/user.service');
const { validationResult } = require('express-validator');
const blacklistTokenModel = require('../models/blacklistToken.model');

module.exports.registerUser = async (req, res, next) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
        return res.status(400).json({ error: error.array() });
    }

    console.log('Request Body:', req.body); // Should show full structure

    // ✅ Destructure exactly from req.body
    const { email, Password } = req.body;
    const { firstname, lastname } = req.body.fullname || {};
    

    // ✅ Add a validation log
    console.log('Extracted:', firstname, lastname, email, Password);

    if (!firstname || !lastname || !email || !Password) {
        return res.status(400).json({ error: "All fields are required." });
    }
         const isUserAlready = await userModel.findOne({email});
    if (isUserAlready) {

        return res.status(400).json({ error: "User already exists" });
    }
    const hashPassword = await userModel.hashPassword(Password);

    const user = await userservice.createUser({
        firstname,
        lastname,
        email,
        Password: hashPassword
    });

    const token = user.generateAuthToken();
    res.status(201).json({ token, user });
};


module.exports.loginUser = async (req, res, next) =>{
     
    const error = validationResult(req);
    if(!error.isEmpty()){
        return res.status(400).json({error: error.array()});
    }

      const{ email, Password} = req.body;
      const user = await userModel.findOne({ email}).select('+Password');
      if(!user){
        return res.status(401).json({error: "Invalid email or password"});
      }

      const isMatch = await user.comparePassword(Password);
        if(!isMatch){
            return res.status(401).json({error: "Invalid email or password"});
        }

        const token = user.generateAuthToken();
        res.cookie('token', token);
        res.status(200).json({ token, user});





}


module.exports.getUserProfile = async( req, res, next) =>{
    res.status(200).json(req.user);
  
}

module.exports.loginUser = async (req, res, next) =>{
    res.clearCookie('token');
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

    await blacklistTokenModel.create({ token });

    res.status(200).json({ message: "Logout successful" });
}