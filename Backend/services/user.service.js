const userModel = require('../models/user.model');

module.exports.createUser = async ({
    firstname,
    lastname,
    email,
    Password
}) => {
    if (!firstname || !lastname || !email || !Password) {
        throw new Error('all fields are required');
    }

    const user = await userModel.create({
        fullname: {
            firstname,
            lastname
        },
        email,
        Password
    });

    return user;
};
