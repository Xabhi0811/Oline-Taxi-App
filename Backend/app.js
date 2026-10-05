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
  'http://127.0.0.1:5173',
  process.env.FRONTEND_URL,
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

app.get('/health', (req, res) => {
  const connected = require('mongoose').connection.readyState === 1;
  res.status(connected ? 200 : 503).json({ status: connected ? 'ready' : 'database-unavailable' });
});


app.use('/users', userRoutes);
app.use('/captains', captainRoutes);
app.use('/map', mapRoutes);
app.use('/rides', rideRoutes);

app.use((err, req, res, next) => {
  if (res.headersSent) return next(err);
  if (err.code === 11000) return res.status(409).json({ message: 'An account with that email already exists' });
  if (err.name === 'ValidationError') return res.status(400).json({ message: 'Please check the submitted details' });
  if (err.type === 'entity.parse.failed') return res.status(400).json({ message: 'Invalid JSON request' });
  res.status(500).json({ message: 'Unable to process the request. Please try again.' });
});

module.exports = app; 
