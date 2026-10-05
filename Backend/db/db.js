const mongoose = require('mongoose');
 function connectToDb(){
    return mongoose.connect(process.env.DB_CONNECT, { serverSelectionTimeoutMS: 10000 }
    ).then(() => {
        console.log('connected to DB');
    }).catch(() => console.error('Database connection failed. Check DB_CONNECT and MongoDB availability.'));
 }

 module.exports = connectToDb ;
