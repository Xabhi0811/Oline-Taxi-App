const userModel = require('../models/user.model');
const userservice = require('../services/user.service');
const {validationResult} = require('express-validator');

module.exports.registerUser = async(req, res , next) =>{
        const error= validationResult(req);
        if(!error.isEmpty()){
            return res.status(400).json({error: error.array()});
        }

        const { firstname , lastname , email , Password} = req.body;
        const hashPassword = await userModel.hashPassword(Password);

        const user = await userservice.createUser({
            firstname,
            lastname,
            email,
            Password: hashPassword
        });

        const token = user.generateAuthToken();
        res.status(201).json({token, user});       
}