const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const userSchema = new mongoose.Schema({
    fullname:{
        firstname:{
        type: String,
        required: true,
        minlength:[3,'frist name must be at least 3 character long'],
    },
    lastname:{
        type: String,
        minlength:[3,'last name must be at least 3 character long'],
    }
},
 email:{
    type: String,
    required: true,
    unique: true,
    minlength:[5, 'it must required ']
 },
 Password:{
    type: String,
   required: true,
    select: false,
 },

socketID:{
    type: String,
},

})

userSchema.methods.generateAuthToken = function(){
    const token = jwt.sign({_id: this._id},process.env.jwt_SECRET);
    return token;
}

userSchema.methods.comparePassword = async function (Password) {
    return await bcrypt.compare(Password,this.Password);
}

userSchema.statics.hashPassword = async function (Password) {
    return await bcrypt.hash(Password,10);
}

const userModel = mongoose.model('user', userSchema);

module.exports = userModel;