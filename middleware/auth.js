// SCRIPT DESCRIPTION: Middleware for authentication with token (used to secure sensitive routes in ../routes/sauce)

// Module dependencies
const jwt = require('jsonwebtoken'); // https://www.npmjs.com/package/jsonwebtoken
const env = require('dotenv').config(); // https://www.npmjs.com/package/dotenv

// Set variable : token string for 'sign()' method of jsonwebtoken module (JSON_WEB_TOKEN to  set in ./.env)
const tokenString = process.env.JSON_WEB_TOKEN;

// Make module available through require() from other project scripts (https://nodejs.org/api/modules.html#module)
module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1]; // Get token from authorization header (second element of array created with split() method)
        const decodedToken = jwt.verify(token, tokenString); // Decode token with verify() method from jsonwebtoken module
        const userId = decodedToken.userId; // Get user's ID from decoded token
        req.auth = { userId };
        if (req.body.userId && req.body.userId !== userId) { // Check if user ID from request is different from user ID from token
            throw 'Invalid User ID !';
        } else {
            next();
        }

    } catch (error) {
        res.status(401).json({ error: error | 'Request not authenticated!' }); // If error -> return status code 401 with error message  (https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/401)
    }
};