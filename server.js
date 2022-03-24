// SCRIPT DESCRIPTION: node server

// Module dependencies
const http = require('http'); // https://nodejs.dev/learn/the-nodejs-http-module
const app = require('./app'); // local module ("Express" app)

// Normalize a port into a number, string, or false
const normalizePort = val => {
    const port = parseInt(val, 10);
    if (isNaN(port)) {
        return val;
    }
    if (port >= 0) {
        return port;
    }
    return false;
};

// Set port
const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

// // Handle specific listen errors with friendly messages
const errorHandler = error => {
    if (error.syscall !== 'listen') {
        throw error;
    }
    const address = server.address();
    const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges.');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use.');
            process.exit(1);
            break;
        default:
            throw error;
    }
};

// Use createServer method from http module to create a local server (https://nodejs.org/dist/latest-v16.x/docs/api/http.html#httpcreateserveroptions-requestlistener)
const server = http.createServer(app);

//Listen to the request events
server.on('error', errorHandler);
server.on('listening', () => {
    const address = server.address();
    const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
    console.log('Listening on ' + bind);
});

server.listen(port);