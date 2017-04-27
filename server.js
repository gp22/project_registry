/* jshint esversion:6, node: true */

/* Chingu Cohorts Build.To.Learn Project Registry API
     © 2017 - ngChingu team
     https://github.com/ngChingu/project_registry
*/

/* ================================= SETUP ================================= */

const express    = require('express'),
      app        = express(),
      morgan     = require('morgan'),
      bodyParser = require('body-parser'),
      port       = process.env.PORT || 3000;


/* ============================= CONFIGURATION ============================= */

app.use(express.static(__dirname + '/public'));
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ 'extended' : 'true' }));
app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

/* ================================ ROUTES ================================= */

require('./routes/apiroutes')(app);
require('./routes/publicroutes')(app);


/* ================================ STARTUP ================================ */

app.listen(port, function () {
    console.log(`Server listening on port ${port}.`);
});
