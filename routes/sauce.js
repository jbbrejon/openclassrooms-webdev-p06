// SCRIPT DESCRIPTION : "Express" routes for "/api/sauces", "/api/sauces/:id" and  "/api/sauces/:id/like" (called from ../app.js)

// Module dependencies
const express = require('express'); // https://www.npmjs.com/package/express
const sauceCtrl = require('../controllers/sauce'); // local module ("sauce" controller)
const auth = require('../middleware/auth'); // local module ("auth" middleware)
const multer = require('../middleware/multer-config'); // local module ("multer-config" middleware)

// Create "Express" router with "Router()" method (http://expressjs.com/en/5x/api.html#router)
const router = express.Router();

// Set route : "/api/sauces" GET requests
router.get('/', auth, sauceCtrl.getAllSauces);
// Set (dynamic) route : "/api/sauces/:id" GET requests
router.get('/:id', auth, sauceCtrl.getOneSauce);
// Set route : "/api/sauces" POST requests
router.post('/', auth, multer, sauceCtrl.createSauce);
// Set (dynamic) route : "/api/sauces/:id/like" POST requests
router.post('/:id/like', auth, sauceCtrl.likeSauce);
// Set (dynamic) route : "/api/sauces/:id" PUT requests
router.put('/:id', auth, multer, sauceCtrl.modifySauce);
// Set (dynamic) route : "/api/sauces/:id" DELETE requests
router.delete('/:id', auth, sauceCtrl.deleteSauce);

// Make module available through require() from other project scripts (https://nodejs.org/api/modules.html#module)
module.exports = router;