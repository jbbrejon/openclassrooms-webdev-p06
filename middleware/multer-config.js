// SCRIPT DESCRIPTION: Middleware for "Multer" configuration - file management : naming, add, remove (called from ../routes/sauce)


// Module dependencies
const multer = require('multer'); // https://www.npmjs.com/package/multer

// Set extension for file name
const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpeg',
    'image/png': 'png'
};

// Call "diskStorage()"" method from multer module
const storage = multer.diskStorage({
    // Set destination
    destination: (req, file, callback) => {
        callback(null, 'images')
    },
    // Set filename
    filename: (req, file, callback) => {
        const name = file.originalname.split(' ').join('_'); // replace " " with "_" in filename (if applicable)
        const extension = MIME_TYPES[file.mimetype]; // extension corresponding to the MIME type of the file in the POST request
        callback(null, name + Date.now() + '.' + extension); // add time stamp to file
    }
});

// Make module available through require() from other project scripts (https://nodejs.org/api/modules.html#module)
module.exports = multer({ storage }).single('image'); // Call "single()"" method from Multer module