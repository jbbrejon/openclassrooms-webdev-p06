// SCRIPT DESCRIPTION : "Mongoose" model for "user" documents in "oc-hotTakes" MongoDB (called from ../controllers/sauce.js)

// Inlude module : "mongoose" (https://www.npmjs.com/package/mongoose)
const mongoose = require('mongoose');

// Call Schema method from mongoose module to set required fiels for the creation of a new "sauce" document (https://mongoosejs.com/docs/guide.html#schemas)
const sauceSchema = mongoose.Schema({
    userId: { type: String, req: true },
    name: { type: String, req: true },
    manufacturer: { type: String, req: true },
    description: { type: String, req: true },
    mainPepper: { type: String, req: true },
    imageUrl: { type: String, req: true },
    heat: { type: Number, req: true },
    likes: { type: Number, req: true, default: 0 },
    dislikes: { type: Number, req: true, default: 0 },
    usersLiked: { type: [String], req: true, default: [] },
    usersDisliked: { type: [String], req: true, default: [] },
});

// Make module available through require() from other project scripts (https://nodejs.org/api/modules.html#module)
module.exports = mongoose.model('Sauce', sauceSchema);