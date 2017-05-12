/* jshint esversion:6, node: true */

/* Chingu Cohorts Build.To.Learn Project Registry API
     © 2017 - ngChingu team
     https://github.com/ngChingu/project_registry
*/

/* ================================= SETUP ================================= */

const express       = require('express'),
      app           = express(),
      morgan        = require('morgan'),
      bodyParser    = require('body-parser'),
      
      db            = require('./db'),
      mongoose      = require('mongoose'),
      
      passport      = require('passport'),
      LocalStrategy = require('passport-local').Strategy,
      
      User          = require('./models/user'),
      Project       = require('./models/project'),
      
      apiRoutes     = require('./routes/apiroutes'),
      authRoutes    = require('./routes/authroutes'),
      publicRoutes  = require('./routes/publicroutes'),
      
      port          = process.env.PORT || 3000;


/* ============================= CONFIGURATION ============================= */

// set static files location
app.use(express.static(__dirname + '/public'));

// enable logger
app.use(morgan('dev'));

// enable body parsing
app.use(bodyParser.urlencoded({ 'extended' : 'true' }));
app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));


/* ================================= CORS ================================= */

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


/* =============================== PASSPORT ================================ */

app.use(passport.initialize());

passport.use(new LocalStrategy(
    
    function(username, password, done) {
        
        User.findOne({ username: username }, { username: 1, salt: 1, hash: 1 }, function (err, user) {
            
            if (err) { return done(err); }
            
            if (!user) { return done(null, false, { message: 'Incorrect User Name'}); }
            
            if (!user.validatePassword(password)) {
                return done(null, false, { message: 'Incorrect Password'});
            }
            
            return done(null, user);
            
        });
    }
));


/* ================================ ROUTES ================================= */

app.use(apiRoutes);
app.use(authRoutes);
app.use(publicRoutes);


/* ============================= ERROR HANDLER ============================ */

app.use(function (err, req, res, next) {
    console.log('Error!\n', err.stack);
    res.status(500).send('Something broke...');
});

/* ============================= CONNECT TO DB ============================= */
mongoose.connect(db.getDbConnectionString());
mongoose.Promise = global.Promise;


/* ================================ STARTUP ================================ */

app.listen(port, function () {
    console.log(`Server listening on port ${port}.`);
});

/* ======= Export express so that it can be used by mocha for tests ======= */

module.exports = { app };
