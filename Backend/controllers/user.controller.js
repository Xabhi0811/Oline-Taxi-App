const userModel = require('../models/user.model');
const userservice = require('../services/user.service');
const { validationResult } = require('express-validator');
const blacklistTokenModel = require('../models/blacklistToken.model');
console.log("✅ blacklistToken.model.js loaded successfully");




module.exports.registerUser = async (req, res, next) => {
    console.log("🧾 req.body:", req.body);
    const error = validationResult(req);
    if (!error.isEmpty()) {
        return res.status(400).json({ error: error.array() });
    }

    const { email, password } = req.body;
    const { firstName, lastName } = req.body.fullName || {};

    console.log("Extracted:", firstName, lastName, email, password);

    // ✅ Fix variable names here
    if (!firstName || !lastName || !email || !password) {
        return res.status(400).json({ error: "All fields are required." });
    }

    const isUserAlready = await userModel.findOne({ email });
    if (isUserAlready) {
        return res.status(400).json({ error: "User already exists" });
    }

    const hashPassword = await userModel.hashPassword(password);

    const user = await userservice.createUser({
        firstname: firstName,
        lastname: lastName,
        email,
        password: hashPassword
    })

    const token = user.generateAuthToken();
    res.status(201).json({ token, user });
};


module.exports.loginUser = async (req, res, next) =>{
     
    const error = validationResult(req);
    if(!error.isEmpty()){
        return res.status(400).json({error: error.array()});
    }

      const{ email, password} = req.body;
      const user = await userModel.findOne({ email}).select('+password');
      if(!user){
        return res.status(401).json({error: "Invalid email or password"});
      }

      const isMatch = await user.comparePassword(password);
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

module.exports.logoutUser = async (req, res, next) =>{
    res.clearCookie('token');
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

    await blacklistTokenModel.create({ token });

    res.status(200).json({ message: "Logout successful" });
}