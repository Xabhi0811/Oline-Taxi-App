
const dotenv = require('dotenv');
dotenv.config();
const express = require('express')
const app = express();
const cors = require('cors');
const connectToDb = require('./db/db');

connectToDb()

app.use(cors());

app.get('/',(req, res)=>{
    res.send("hello");
});


module.exports = app;