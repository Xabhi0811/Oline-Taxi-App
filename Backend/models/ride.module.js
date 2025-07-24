  const mongoose = require('mongoose')


  const rideSchema = new mongoose.Schema({
    user:{
           type: mongoose.Schema.Types.ObjectId,
           ref: 'User',
           require: true
    },

    captain:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'captain'
    },

    pickup:{
        type: String,
        require: true,
    },

    destination:{
        type: String,
        require: true,
    },

    fare:{
        type: Number,
        require: true,
    },

    status:{
        type: String,
        enum: ['pending', 'accepted', 'ongaoing', 'completed', 'cancelled'],
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

})


module.exports = mongoose.model('ride' , rideSchema);