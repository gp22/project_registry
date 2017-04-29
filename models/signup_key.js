/* jshint esversion:6, node: true */

/*
   defines schema and model for registration keys
*/

'use strict';

const mongoose = require('mongoose'),
      
      signupKeySchema = new mongoose.Schema({
          key: {
              type     : String,
              required : true,
              trim     : true,
              unique   : true
          },
          ts: Number,   // time stamp in milliseconds
          exp: Number   // expiry: 24 hours from timestamp
      });


/* ================================ EXPORT ================================= */

module.exports = mongoose.model('SignupKey', signupKeySchema);
