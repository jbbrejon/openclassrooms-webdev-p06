// SCRIPT DESCRIPTION : "Mongoose" model for "user" documents in "oc-hotTakes" in MongoDB (called from ../controllers/users.js)

// Module dependencies
const mongoose = require('mongoose'); //(https://www.npmjs.com/package/mongoose)
const uniqueValidator = require('mongoose-unique-validator'); // (https://www.npmjs.com/package/mongoose-unique-validator)

// Call Schema method from mongoose module to set required fiels for the creation of a new "user" document  (https://mongoosejs.com/docs/guide.html#schemas)
const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

// Apply the uniqueValidator plugin to userSchema
userSchema.plugin(uniqueValidator);

// Make module available through "require()"" from other project scripts (https://nodejs.org/api/modules.html#module)
module.exports = mongoose.model('User', userSchema);