// SCRIPT DESCRIPTION : "Express" routes for "/api/auth/signup" and "api/auth/login" (called from ../app.js)

// Module dependencies
const express = require('express'); // (https://www.npmjs.com/package/express)
const userCtrl = require('../controllers/user'); // local module
const emailValidator = require('../middleware/email-validator') // local module (middleware for email validation)
const passwordValidator = require('../middleware/password-validator') // local module (middleware for password validation)
const rateLimit = require('../middleware/rate-limit') // local module (middleware to limit connection attempts)

// Create "Express" router with "Router()" method (http://expressjs.com/en/5x/api.html#router)
const router = express.Router();

// Set route : "/api/auth/signup" POST requests
router.post('/signup', emailValidator, passwordValidator, userCtrl.signup);

// Set route : "/api/auth/login" POST requests
router.post('/login', rateLimit, userCtrl.login);

// Make module available through require() from other project scripts (https://nodejs.org/api/modules.html#module)
module.exports = router;