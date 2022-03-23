// SCRIPT DESCRIPTION : Controller for "/api/sauces", "/api/sauces/:id" and  "/api/sauces/:id/like"  (called from ../routes/sauce.js)

// Module dependencies
const Sauce = require('../models/Sauce'); // local module (Mongoose model)
const fs = require('fs'); // https://nodejs.dev/learn/the-nodejs-fs-module

// CRUD(CREATE) - Set "createSauce" operation (create new "sauce" document in "oc-hotTakes" in MongoDB)
exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce) // Parse request (from string to object) sent by "multer-config" middleware
    delete sauceObject._id; // Remove ID from request (_id will be set automatically by MongoDB)
    const sauce = new Sauce({ // Create new instance of "Sauce" model
        ...sauceObject, // Use spread operator to get all fiels from object 
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`, // Set image URL based on filename sent by "multer-config" middleware
    }); // create new sauce based on mongoose model
    sauce.save() // Call "save()" method from mongoose module to create new "sauce" document in MongoDB
        .then(() => res.status(201).json({ message: 'Sauce created!' })) // If success, return status code 201 with confirmation message (https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/201)
        .catch(error => res.status(400).json({ error })); // If error, return status code 400 with error message (https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/400)
};

// CRUD(READ) - Set "getOneSauce" operation (get "sauce" document in "oc-hotTakes" in MongoDB)
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id }) // Call "findOne() method from mongoose module to get requested "sauce" document content (filter : "id" from GET request)
        .then(sauce => res.status(200).json(sauce)) // If success -> return status code 200 and requested "sauce" document content in json (https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/200)
        .catch(error => res.status(404).json({ error })); // If error -> return status code 404 and error message in json (https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/400)
};

// CRUD(READ) - Set "getAllSauces" operation (get all "sauce" documents in "oc-hotTakes" in MongoDB)
exports.getAllSauces = (req, res, next) => {
    Sauce.find() // Call "find()" method from mongoose module to get all "sauce" documents content
        .then(sauces => res.status(200).json(sauces)) // If success -> return status code 200 and all "sauce" documents with their content in json (https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/200)
        .catch(error => res.status(400).json({ error })); // If error -> return status code 400 and error message in json (https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/400)
};


// CRUD(UPDATE) - Set "modifySauce" operation (modify "sauce" document in "oc-hotTakes" in MongoDB)
exports.modifySauce = (req, res, next) => {
    // Compare user id from PUT request with user id from oc-hotTakes MongoDB
    Sauce.findOne({ _id: req.params.id })
        .then((sauce) => {
            if (!sauce) { // Check if "sauce" document exists
                return res.status(404).json({
                    error: new Error('Sauce not found!') // If not found -> Return status code 404 with error message
                });
            }
            if (sauce.userId !== req.auth.userId) { // Check if user id from PUT request match with user ID from oc-hotTakes MongoDB
                return res.status(403).json({
                    error: new Error('403: unauthorized request') // If user ids don't match  -> Return status code 403 with error message (https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/403)
                });
            }
            // Remove file if a new image is uploaded
            if (req.file) {
                const filename = sauce.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`, (error) => {
                    if (error) {
                        throw error;
                    }
                })
            }
            // Check if image was modified by user
            const sauceObject = req.file ?
                {
                    ...JSON.parse(req.body.sauce),
                    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}` // Set new image URL based on filename sent by "multer-config" middleware
                } : { ...req.body };
            Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
                .then(() => res.status(200).json({ message: 'Sauce modified!' })) // If success -> return status code 200 and confirmation message (https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/200)
                .catch(error => res.status(400).json({ error })); // If error -> return status code 400 and error message in json (https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/400)
        })
        .catch(error => res.status(500).json({ error }));
};


// CRUD(UPDATE) - Set "likeSauce" operation (change "like" or "dislike" of "sauce" document in "oc-hotTakes" in MongoDB)
exports.likeSauce = (req, res, next) => {
    const like = req.body.like;
    const idSauce = req.params.id;

    Sauce.findOne({ _id: idSauce })
        .then(sauce => {
            const idIncluded = !sauce.usersLiked.includes(req.body.userId) && !sauce.usersDisliked.includes(req.body.userId);
            if (like === 1 && idIncluded) {
                Sauce.updateOne({ _id: idSauce }, {
                    $push: { usersLiked: req.body.userId },
                    $inc: { likes: +1 }
                })
                    .then(() => res.status(200).json({ message: 'like added !' }))
                    .catch(error => res.status(400).json({ error }));
            } else if (like === -1 && idIncluded) {
                Sauce.updateOne({ _id: idSauce }, {
                    $push: { usersDisliked: req.body.userId },
                    $inc: { dislikes: +1 }
                })
                    .then(() => res.status(200).json({ message: 'dislike added !' }))
                    .catch(error => res.status(400).json({ error }));
            } else {
                if (sauce.usersLiked.includes(req.body.userId)) {
                    Sauce.updateOne({ _id: idSauce }, {
                        $pull: { usersLiked: req.body.userId },
                        $inc: { likes: -1 }
                    })
                        .then(() => res.status(200).json({ message: 'like removed !' }))
                        .catch(error => res.status(400).json({ error }));
                } else if (sauce.usersDisliked.includes(req.body.userId)) {
                    Sauce.updateOne({ _id: idSauce }, {
                        $pull: { usersDisliked: req.body.userId },
                        $inc: { dislikes: -1 }
                    })
                        .then(() => res.status(200).json({ message: 'dislike removed !' }))
                        .catch(error => res.status(400).json({ error }));
                }
            }
        })
};


// CRUD(DELETE) - Set "deleteSauce" operation (delete "sauce" document in "oc-hotTakes" in MongoDB)
exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id }) // Call "findOne()" method from mongoose module to get requested "sauce" document )
        .then((sauce) => {
            if (!sauce) { // Check if "sauce" document exists
                return res.status(404).json({
                    error: new Error('Sauce not found!') // If sauce cannot be found -> return status code 404 and error message (https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/404)
                });
            }
            if (sauce.userId !== req.auth.userId) {
                return res.status(403).json({ // Check if user id from PUT request match with user ID from oc-hotTakes MongoDB
                    error: new Error('403: unauthorized request') // // If user ids don't match  -> Return status code 403 with error message (https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/403)
                });
            }
            // Remove file from "images" folder
            const filename = sauce.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
                Sauce.deleteOne({ _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'Sauce removed!' }))
                    .catch(error => res.status(400).json({ error }));
            });
        })
        .catch(error => res.status(500).json({ error }));
};

