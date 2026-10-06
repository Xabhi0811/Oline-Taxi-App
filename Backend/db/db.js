const mongoose = require('mongoose');
 function connectToDb(){
    return mongoose.connect(process.env.DB_CONNECT, { serverSelectionTimeoutMS: 10000 }
    ).then(() => {
        console.log('connected to DB');
    });
 }

 module.exports = connectToDb ;
