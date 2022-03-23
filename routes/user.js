// SCRIPT DESCRIPTION : "Express" routes for "/api/auth/signup" and "api/auth/login" (called from ../app.js)


// Module dependencies
const express = require('express'); // (https://www.npmjs.com/package/express)
const userCtrl = require('../controllers/user'); // local module

// Create "Express" router with "Router()" method (http://expressjs.com/en/5x/api.html#router)
const router = express.Router();

// Set route : "/api/auth/signup" POST requests (arguments : request -> address, response -> from controllers/user)
router.post('/signup', userCtrl.signup);

// Set route : "/api/auth/login" POST requests (arguments : request -> address, response -> from controllers/user)
router.post('/login', userCtrl.login);

// Make module available through require() from other project scripts (https://nodejs.org/api/modules.html#module)
module.exports = router;