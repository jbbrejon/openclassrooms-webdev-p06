// SCRIPT DESCRIPTION : "Express" routes for "/api/sauces", "/api/sauces/:id" and  "/api/sauces/:id/like" (called from ../app.js)

// Module dependencies
const express = require('express'); // https://www.npmjs.com/package/express
const sauceCtrl = require('../controllers/sauce'); // local module ("sauce" controller)
const auth = require('../middleware/auth'); // local module ("auth" middleware)
const multer = require('../middleware/multer-config'); // local module ("multer-config" middleware)


// Create "Express" router with "Router()" method (http://expressjs.com/en/5x/api.html#router)
const router = express.Router();


// Set route : "/api/sauces" GET request (arguments : request -> address, middleware -> auth, response -> from controllers/sauce)
router.get('/', auth, sauceCtrl.getAllSauces);
// Set (dynamic) route : "/api/sauces/:id" GET request (arguments : request -> address, middleware -> auth, response -> from controllers/sauce)
router.get('/:id', auth, sauceCtrl.getOneSauce);
// Set route : "/api/sauces" POST request (arguments : request -> address, middleware -> auth, middleware -> multer, response -> from controllers/sauce)
router.post('/', auth, multer, sauceCtrl.createSauce);
// Set (dynamic) route : "/api/sauces/:id/like" POST request (arguments : request -> address, middleware -> auth, response -> from controllers/sauce)
router.post('/:id/like', auth, sauceCtrl.likeSauce);
// Set (dynamic) route : "/api/sauces/:id" PUT request (arguments : request -> address, middleware -> auth, middleware -> multer, response -> from controllers/sauce)
router.put('/:id', auth, multer, sauceCtrl.modifySauce);
// Set (dynamic) route : "/api/sauces/:id" DELETE request (arguments : request -> address, middleware -> auth, response -> from controllers/sauce)
router.delete('/:id', auth, sauceCtrl.deleteSauce);

module.exports = router;