// SCRIPT DESCRIPTION : Controller for "/api/auth/signup" and "api/auth/login" (called from ../routes/user.js)

// Module dependencies
const bcrypt = require('bcrypt'); // https://www.npmjs.com/package/bcrypt
const jwt = require('jsonwebtoken'); // https://www.npmjs.com/package/jsonwebtoken
const env = require('dotenv').config(); // https://www.npmjs.com/package/dotenv
const User = require('../models/User'); // local module (Mongoose model)

// Set variable : token string for 'sign()' method of jsonwebtoken
const tokenString = process.env.JSON_WEB_TOKEN; // Token string to be set in ./.env (not synced with git)

// CRUD(CREATE) - Set "signup" operations (create new "user" document in "oc-hotTakes" in MongoDB)
exports.signup = (req, res, next) => {
    // Call "hash() method from bcrypt module" (arguments : password from post request, rounds to run hash algorythm)
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const user = new User({
                email: req.body.email,
                password: hash
            });
            // Call "save()" method from mongoose model to create new "user" document
            user.save()
                .then(() => res.status(201).json({ message: 'User created!' }))
                .catch(error => res.status(400).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};

// CRUD(READ) - Set "login" operations (find existing "user" document in "oc-hotTakes" in MongoDB and check password with bcrypt)
exports.login = (req, res, next) => {
    // Call "findOne() method from mongoose module to check if the user exists" (filter : email from post request)
    User.findOne({ email: req.body.email })
        .then(user => {
            if (!user) {
                return res.status(401).json({ error: 'User not found!' })
            }
            // Call "compare()" method from bcrypt module (arguments : password from request, hashed password from MongoDB)
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ error: 'Incorrect password!' });
                    }
                    res.status(200).json({
                        userId: user._id,
                        // Call sign() method from jsonwebtoken module (arguments : user's id from MongoDB, token string, expiration)
                        token: jwt.sign(
                            { userId: user._id },
                            tokenString,
                            { expiresIn: '24h' }
                        )
                    });
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }))
};