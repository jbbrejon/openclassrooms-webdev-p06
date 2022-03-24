// SCRIPT DESCRIPTION : set connection attempts to 5 and block new attemps for 10 minutes (called from ../routes/user)

// Module dependencies
const rateLimit = require('express-rate-limit'); // https://www.npmjs.com/package/express-rate-limit

// Set limit (5 attempts max, then blocked for 10 minutes) 
const limiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 5,
    standardHeaders: true,
    legacyHeaders: false,
    message: "5 unsuccessfull connections. You're blocked for 10 minutes!"
});

module.exports = limiter;