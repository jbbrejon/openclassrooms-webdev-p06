// SCRIPT DESCRIPTION : "Express" app

// Module dependencies.
const express = require('express');

// Create "Express" app
const app = express();

// Display requested url in console
app.use((req, res, next) => {
    console.log(`Request on : "${req.url}"`);
    next();
})

// Set response status
app.use((req, res, next) => {
    res.status(201);
    next();
})

app.use((req, res, next) => {
    res.json({ message: 'Votre requête a bien été reçue !' });
    next();
}); // Send response to all request in JSON

// Display response in console
app.use((req, res) => {
    console.log(`Response status : ${res.statusCode}`);
});

// Make module available through "require()" from other project scripts (https://nodejs.org/api/modules.html#module)
module.exports = app;