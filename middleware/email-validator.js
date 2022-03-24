// SCRIPT DESCRIPTION : forcer users to type a valid e-mail address

// Module dependencies
const validator = require('validator'); // https://www.npmjs.com/package/validator

// Check if email from POST request complies with email validator requirements
module.exports = (req, res, next) => {
    if (!validator.isEmail(req.body.email)) {
        return res.status(400).json({ message: "Please type a valid e-mail address!" });
    } else {
        next();
    }
};