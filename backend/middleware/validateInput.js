// backend/middleware/validateInput.js
const xss = require('xss-clean');

const sanitizeInput = (req, res, next) => {
    xss()(req, res, () => {
        next();
    });
};

module.exports = sanitizeInput;