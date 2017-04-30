/* jshint esversion:6, node: true */

/*
   defines schema and model for our users
*/

'use strict';

const dotenv     = require('dotenv').config(),
      mongoose   = require('mongoose'),
      passportLocalMongoose = require('passport-local-mongoose'),
      jwt        = require('jsonwebtoken'),
      crypto     = require('crypto'),
      secret     = process.env.JWT_SECRET,
      
      userSchema = new mongoose.Schema({
          username: {
              type   : String,
              unique : true
          },
          role: {
              type : String,
              enum: ['admin', 'non-admin'],
              default: 'non-admin'
          },
          hash: String,
          salt: String
      });

userSchema.plugin(passportLocalMongoose);


/* ================================ METHODS ================================ */

// salt and hash plain text password
userSchema.methods.hashPassword = function (pwd) {
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(pwd, this.salt, 10000, 512, 'sha512').toString('hex');
};


// hash and compare submitted password to stored hash in db
// returns 'true' if they match
userSchema.methods.validatePassword = function (pwd) {
    const hash = crypto.pbkdf2Sync(pwd, this.salt, 10000, 512, 'sha512').toString('hex');
    return this.hash === hash;
};


// generate and sign JWT with default HMAC SHA256
userSchema.methods.generateJWT = function () {

    return jwt.sign({
        _id     : this._id,
        username: this.username
    }, secret, { expiresIn: '24h' });
    
};


/* ================================ EXPORT ================================= */

module.exports = mongoose.model('User', userSchema);
