// SCRIPT DESCRIPTION : Controller for "/api/sauces", "/api/sauces/:id" and  "/api/sauces/:id/like"  (called from ../routes/sauce.js)

// Module dependencies
const Sauce = require('../models/Sauce'); // local module (Mongoose model)
const fs = require('fs'); // https://nodejs.dev/learn/the-nodejs-fs-module

// CRUD(CREATE) - Set "createSauce" operations (create new "sauce" document in "oc-hotTakes" in MongoDB)
exports.createSauce = (req, res, next) => {
    // Parse request sent by "multer-config" middleware
    const sauceObject = JSON.parse(req.body.sauce)
    // Remove ID from request (_id will be set automatically by MongoDB)
    delete sauceObject._id;
    // Create new instance of "Sauce" model
    const sauce = new Sauce({
        // Use spread operator to get all fiels from object
        ...sauceObject,
        // Set image URL based on filename sent by "multer-config" middleware
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
    });
    // Call "save()" method from mongoose module to create new "sauce" document in MongoDB
    sauce.save()
        .then(() => res.status(201).json({ message: 'Sauce created!' }))
        .catch(error => res.status(400).json({ error }));
};

// CRUD(READ) - Set "getOneSauce" operations (get "sauce" document from "oc-hotTakes" in MongoDB)
exports.getOneSauce = (req, res, next) => {
    // Call "findOne() method from mongoose module to get requested "sauce" document (filter : "id" from URL)
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({ error }));
};

// CRUD(READ) - Set "getAllSauces" operation (get all "sauce" documents from "oc-hotTakes" in MongoDB)
exports.getAllSauces = (req, res, next) => {
    // Call "find()" method from mongoose module to get all "sauce" documents
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({ error }));
};

// CRUD(UPDATE) - Set "modifySauce" operation (modify "sauce" document in "oc-hotTakes" in MongoDB)
exports.modifySauce = (req, res, next) => {
    // Call "findOne()" method from mongoose module to get "sauce" document
    Sauce.findOne({ _id: req.params.id })
        .then((sauce) => {
            // Check if "sauce" document exists
            if (!sauce) {
                return res.status(404).json({
                    error: new Error('Sauce not found!')
                });
            }
            // Check if user ID from PUT request is the same as user ID from "oc-hotTakes" MongoDB
            if (sauce.userId !== req.auth.userId) {
                return res.status(403).json({
                    error: new Error('403: unauthorized request')
                });
            }
            // Remove file if a new image has been uploaded
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
                    // Parse request sent by "multer-config" middleware
                    ...JSON.parse(req.body.sauce),
                    // Set new image URL based on filename sent by "multer-config" middleware
                    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
                } : { ...req.body };
            // Call "updateOne()" method from mongoose module to modify "sauce" document
            Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
                .then(() => res.status(200).json({ message: 'Sauce modified!' }))
                .catch(error => res.status(400).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};


// CRUD(UPDATE) - Set "likeSauce" operation (change "like" or "dislike" of "sauce" document in "oc-hotTakes" in MongoDB)
exports.likeSauce = (req, res, next) => {
    // Get "like" and "ID" from request
    const like = req.body.like;
    const idSauce = req.params.id;
    // Call "findOne()" method from mongoose module to get "sauce" document
    Sauce.findOne({ _id: idSauce })
        .then(sauce => {
            const idIncluded = !sauce.usersLiked.includes(req.body.userId) && !sauce.usersDisliked.includes(req.body.userId);
            if (like === 1 && idIncluded) {
                // Call "updateOne()" method from mongoose module to modify "sauce" document
                Sauce.updateOne({ _id: idSauce }, {
                    $push: { usersLiked: req.body.userId },
                    $inc: { likes: +1 }
                })
                    .then(() => res.status(200).json({ message: 'like added!' }))
                    .catch(error => res.status(400).json({ error }));
            } else if (like === -1 && idIncluded) {
                // Call "updateOne()" method from mongoose module to modify "sauce" document
                Sauce.updateOne({ _id: idSauce }, {
                    $push: { usersDisliked: req.body.userId },
                    $inc: { dislikes: +1 }
                })
                    .then(() => res.status(200).json({ message: 'dislike added!' }))
                    .catch(error => res.status(400).json({ error }));
            } else {
                if (sauce.usersLiked.includes(req.body.userId)) {
                    // Call "updateOne()" method from mongoose module to modify "sauce" document
                    Sauce.updateOne({ _id: idSauce }, {
                        $pull: { usersLiked: req.body.userId },
                        $inc: { likes: -1 }
                    })
                        .then(() => res.status(200).json({ message: 'like removed!' }))
                        .catch(error => res.status(400).json({ error }));
                } else if (sauce.usersDisliked.includes(req.body.userId)) {
                    // Call "updateOne()" method from mongoose module to modify "sauce" document
                    Sauce.updateOne({ _id: idSauce }, {
                        $pull: { usersDisliked: req.body.userId },
                        $inc: { dislikes: -1 }
                    })
                        .then(() => res.status(200).json({ message: 'dislike removed!' }))
                        .catch(error => res.status(400).json({ error }));
                }
            }
        })
};


// CRUD(DELETE) - Set "deleteSauce" operation (delete "sauce" document from "oc-hotTakes" in MongoDB)
exports.deleteSauce = (req, res, next) => {
    // Call "findOne()" method from mongoose module to get "sauce" document
    Sauce.findOne({ _id: req.params.id })
        .then((sauce) => {
            if (!sauce) {
                // Check if "sauce" document exists
                return res.status(404).json({
                    error: new Error('Sauce not found!')
                });
            }
            // Check if user ID from DELETE request is the same as user ID from "oc-hotTakes" MongoDB
            if (sauce.userId !== req.auth.userId) {
                return res.status(403).json({
                    error: new Error('403: unauthorized request')
                });
            }
            // Remove file from "images" folder
            const filename = sauce.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
                // Call "deleteOne()" method from mongoose module to delete "sauce" document from MongoDB
                Sauce.deleteOne({ _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'Sauce removed!' }))
                    .catch(error => res.status(400).json({ error }));
            });
        })
        .catch(error => res.status(500).json({ error }));
};

