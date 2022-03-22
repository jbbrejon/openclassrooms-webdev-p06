// SCRIPT DESCRIPTION : Node server with http module

// Module dependencies.
const http = require('http'); // https://nodejs.dev/learn/the-nodejs-http-module
const app = require('./app'); // Express app (local module)

app.set('port', process.env.PORT || 3000); // Set "express" app port (port 3000 or process.env.PORT if unavailable)

// Create node server with "createServer" method
const server = http.createServer(app); // Call express app each time a request is sent to the server


// Listen to requests on port 3000 or process.env.PORT if unavailable
server.listen(process.env.PORT || 3000);

