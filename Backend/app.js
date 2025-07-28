const dotenv = require('dotenv');
dotenv.config();
const express = require('express')
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectToDb = require('./db/db');
const userRoutes = require('./routes/user.routes');
const captainRoutes= require('./routes/captain.routes');
const mapRoutes = require('./routes/map.routes');
const rideRoutes = require('./routes/ride.routes')
connectToDb()

const allowedOrigins = [
  'http://localhost:5173',
  'https://lx36v5dk-5173.inc1.devtunnels.ms'
];
// ✅ Fix CORS here
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use(cookieParser());


app.get('/',(req, res)=>{
    res.send("hello");
});


app.use('/users', userRoutes);
app.use('/captains', captainRoutes);
app.use('/map', mapRoutes);
app.use('/rides', rideRoutes);

module.exports = app; 