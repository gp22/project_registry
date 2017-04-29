/* jshint esversion:6, node: true */

'use strict';

const routes = require('express').Router(),
      path   = require('path');

routes.get('/', (req, res) => {
    // load front-end - Angular handles front-end routing
    res
        .status(200)
        .sendFile(path.join(__dirname, '../public/index.html'));
});

module.exports = routes;
