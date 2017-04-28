/* jshint esversion:6, node: true */

/*
   non-secured routes to handle user signup and login
*/

'use strict';

const routes   = require('express').Router(),
      User     = require('../models/user'),
      passport = require('passport');


/* ============================ HANDLE SIGNUPS ============================= */

routes.post('/api/signup', (req, res, next) => {
    
    // verify existence of required inputs
    if (!req.body.username || !req.body.password) {
        return res
            .status(400)
            .json({ message: 'Please complete all fields.'});
    }
    
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
                
                const token = user.generateJWT();  // another method? -- see model
                return res
                    .status(201)  // 'created'
                    .json({ 'token' : token });
                
            });
            
        }
        
    });
    
});


/* ============================= HANDLE LOGINS ============================= */

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
