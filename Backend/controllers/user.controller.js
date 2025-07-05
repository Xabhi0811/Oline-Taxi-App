const userModel = require('../models/user.model');
const userservice = require('../services/user.service');
const { validationResult } = require('express-validator');

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
