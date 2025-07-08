const captainModel = require('../models/captain.module');

module.exports.createCaptain = async ({ fullname, email, password, vehicle }) => {
    if (
        !fullname?.firstname ||
        !email ||
        !password ||
        !vehicle?.color ||
        !vehicle?.plate ||
        !vehicle?.capacity ||
        !vehicle?.vehicleType
    ) {
        throw new Error("All fields are required");
    }

    const captain = new captainModel({
        fullname,
        email,
        password,
        vehicle
    });

    return await captain.save();
};
