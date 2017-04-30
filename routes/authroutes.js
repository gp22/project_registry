/* jshint esversion:6, node: true */

/*
   non-secured routes to handle user signup and login
*/

'use strict';

const path      = require('path'),
      crypto    = require('crypto'),
      routes    = require('express').Router(),
      User      = require('../models/user'),
      SignupKey = require('../models/signup_key'),
      passport  = require('passport');


/* ================================ ROUTES ================================= */

/* Route to generate new user signup keys.
   Returns fail status + message -or- success status + key & custom URL
*/
routes.get('/api/signupkeygen', (req, res, next) => {
    
    var buf = crypto.randomBytes(24),
        key = buf.toString('hex'),
        ts  = Date.now(),     // time in milliseconds
        exp = ts + 86400000,  // 1 day = 86400000 ms
        str = `${key.length} bytes of random data: ${key}`,
        url = `https://chingu-project-registry.herokuapp.com/api/signup?key=${key}`;
        
    // check if key already in database
    SignupKey.findOne({ key: key}, (err, foundKey) => {
        
        if (err) throw err;
        
        // if key already exists, return error. Else, save new key.
        if (foundKey) {
            return res
                .status(400)
                .json({ message: 'Key collision - generate a new one.'});
            
        } else {
            let newkey = new SignupKey({
                key: key,
                ts : ts,
                exp: exp
            });
            
            
            newkey.save(function (err) {
                
                if (err) throw err;
                
                res.status(200).json({
                    str,
                    url
                });
                
            });
            
        }
        
    });
        
});


/* Route to check validity of signup key.
   Returns status as a string.
   Todo: Returns either an unauth page or the registration page.
*/
routes.get('/api/signup', (req, res, next) => {
    
    // verify existence of signup key
    if (!req.query.key) {
        return res
            .status(400)
            .json({ message: 'Missing signup key.'});
    }
    
    // check db for key
    SignupKey.findOne({ key: req.query.key}, (err, foundKey) => {
        
        if (err) throw err;
        
        if (!foundKey) {
            return res
                .status(404)
                .json({ message: 'Registration key not found.'});
                // send the unauthorized page/view/template
        
        } else {
            return res
                .status(200)  // 'ok'
                //.send(`Token found and valid.`);
                .sendFile('features/signup/signup.html', { root: path.join(__dirname, '../public')});
                
            
        }
        
    });
    
});


/* Route to handle new user signup.
   Returns fail status + message -or- success status + JWT
*/
routes.post('/api/signup', (req, res, next) => {

    // verify existence of required inputs
    if (!req.body.username || !req.body.password) {
        return res
            .status(400)
            .json({ message: 'Please complete all fields.'});
    }
    
    // verify existence of signup key
    if (!req.body.key) {
        return res
            .status(400)
            .json({ message: 'Missing signup key.'});
    }
    
    // verify signup key has not expired
    SignupKey.findOne({ key: req.body.key})
        .exec()
        .then(function (foundKey) {
        
            if (!foundKey) {
                return 'not found';
        
            } else {
                let expired = Date.now() > foundKey.exp;
                return (expired) ? 'expired' : 'valid';
                
            }
        })
        .then(function (status) {
        

            if (status === 'not found') {
                return res
                    .status(404)  // not found
                    .json({ message: 'Registration key not found.'});
            } else if (status === 'expired') {
                return res
                    .status(401)  // unauthorized
                    .json({ message: 'Registration key has expired.' });
            } else if (status === 'valid') {
        
                // check if username already in database
                User.findOne({ username: req.body.username}, (err, user) => {

                    if (err) throw err;

                    // if user already exists, return error. Else, create user.
                    if (user) {
                        return res
                            .status(400)   // 'bad request'
                            .json({ message: 'Username already taken.'});

                    } else {
                        let user = new User();
                        user.username = req.body.username;
                        user.hashPassword(req.body.password);

                        user.save(function (err) {
                            if (err) throw err;

                            const token = user.generateJWT();
                            return res
                                .status(201)  // 'created'
                                .json({ 'token' : token });

                        });
                    }
                });
            }
        });

});


/* Route to handle user login.
   Returns fail status + info -or- success status + JWT
*/
routes.post('/api/login', (req, res, next) => {

    // verify existence of required inputs
    if (!req.body.username || !req.body.password) {
        return res
            .status(400)
            .json({ message: 'Please complete all fields.'});
    }
    
    passport.authenticate('local', function (err, user, info) {
        
        if (err) { return next(err); }
        
        if (!user) {
            
            return res
                .status(401)
                .json(info);
            
        } else {
            
            // generate and return JWT in our response
            const token = user.generateJWT();
            return res
                .status(200)
                .json({ 'token' : token });
            
        }
        
    })(req, res, next);
    
});


/* ================================ EXPORT ================================= */

module.exports = routes;
