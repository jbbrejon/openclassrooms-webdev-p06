// SCRIPT DESCRIPTION : "Express" app (called from ./server.js)

// Module dependencies
const express = require('express'); // https://www.npmjs.com/package/express
const env = require('dotenv').config(); // https://www.npmjs.com/package/dotenv
const mongoose = require('mongoose'); // https://www.npmjs.com/package/mongoose
const userRoutes = require('./routes/user'); // local module


// Connection to mango database
const connectionString = process.env.CONNECTION_STRING; // Connection string to be set in ./.env (not synced with git)
mongoose.connect(connectionString,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Success : connection to oc-hotTakes db (MongoDB Atlas)!'))
    .catch(() => console.log('Error : no connection to oc-hotTakes db (MongoDB Atlas)!'));

// Create "Express" app
const app = express();

// Set CORS rules : allow GET, POST, PUT, DELETE requets from another server (frontend on localhost:4200, backend on localhost:3000)
app.use('/', (req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); // Allow access from anywhere
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'); // Allow specific html headers
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS'); // Allow HTTP verbs
    next();
})

// Parse incoming requests with JSON payloads (http://expressjs.com/en/api.html#express.json)
app.use(express.json());

//Specify which route settings to call
app.use('/api/auth', userRoutes);




// Make module available through "require()" from other project scripts (https://nodejs.org/api/modules.html#module)
module.exports = app;