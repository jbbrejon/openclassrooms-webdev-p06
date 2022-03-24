// SCRIPT DESCRIPTION : force users to set a strong password (called from ../routes/user)

// Module dependencies
const passwordValidator = require('password-validator');

// Create password schema
const passwordSchema = new passwordValidator();

passwordSchema
    .is().min(8)                                    // Minimum length 8
    .is().max(30)                                  // Maximum length 100
    .has().uppercase()                              // Must have uppercase letters
    .has().lowercase()                              // Must have lowercase letters
    .has().digits(2)                                // Must have at least 2 digits
    .has().not().spaces()                           // Should not have spaces
    .is().not().oneOf(['Passw0rd', 'Password123']); // Blacklist these values

// Check if password from POST request complies with password schema
module.exports = (req, res, next) => {
    if (!passwordSchema.validate(req.body.password)) {
        return res.status(400).json({ message: "Please type a strong password : between 8 and 30 characters (at least one uppercase, one lowercase, 2 digits and one special character)." });
    } else {
        next();
    }
};