const userModel = require ('../models/user.model');

module.exports.createUser = async({
    firstname , lastname , email , Password
})=>{
    if(!firstname || !email || !Password){
        throw new Error('all fields are required');

    }
    const user = await serModel.create({
        fullname:{
            firstname:fullname.firstname,
            lastname:fullname.lastname
        },
        email,
        Password
    })
    return user;
}