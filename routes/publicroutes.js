/* jshint esversion:6, node: true */

const path = require('path');

module.exports = function (app) {
    
    app.get('/', (req, res) => {
        // load front-end - Angular handles front-end routing
        res.sendFile(path.join(__dirname, '../public/index.html'));
    });
    
};
