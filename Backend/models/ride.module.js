  const mongoose = require('mongoose')


  const rideSchema = new mongoose.Schema({
    offeredCaptains: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Captain', select: false }],
    user:{
           type: mongoose.Schema.Types.ObjectId,
           ref: 'user',
           required: true
    },

    captain:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Captain'
    },

    pickup:{
        type: String,
        required: true,
    },

    destination:{
        type: String,
        required: true,
    },

    vehicleType:{
        type: String,
        enum: ['auto', 'car', 'bike'],
        required: true,
    },

    fare:{
        type: Number,
        required: true,
    },

    status:{
        type: String,
        enum: ['pending', 'accepted', 'ongoing', 'completed', 'cancelled'],
        default: 'pending',
    },

    duration:{
        type: Number,
    },

    distance:{
        type: Number,
    },

    paymentID:{
        type: String,

    },

    orderId:{
        type: String,
    },

    signature:{
        type: String,
    },

    Otp:{
        type: String,
        select: false,
        required: true,
    },

})


module.exports = mongoose.model('ride' , rideSchema);
