/* jshint esversion:6, node: true */

/*  ======================== API Route Descriptions ====================
    VERB      URL                         DESCRIPTION
    --------------------------------------------------------------------
    GET       /api/projects               Get all of the projects
    GET       /api/projects/:id           Get a single project
    POST      /api/projects               Create a single project
    PUT       /api/projects/:id           Update a project with new info
    DELETE    /api/projects/:id           Delete a single project
*/

/*  Authentication Middleware Notes:
    POST PUT and DELETE require auth. To be added later.
    When added, uncomment 'authMiddleware' in those routes.
*/

const routes   = require('express').Router(),
      jwt      = require('express-jwt'),
      Project  = require('../models/project'),
      
      // Config express-jwt with our super secret secret and the name of
      // the req object property that has the JWT ('token')
      secret   = process.env.JWT_SECRET,
      auth     = jwt({ secret: secret, requestProperty: 'token' });


/* ============================= PUBLIC ROUTES ============================= */


// GET all projects
routes.get('/api/projects', (req, res) => {
    
    Project.find( (err, projects) => {
        if (err) throw err;
        
        res.status(200).json(projects);
    });
});


// GET one project
routes.get('/api/projects/:id', (req, res) => {

    let target  = req.params.id;
    
    Project.findOne({ _id: target }, (err, project) => {
        
        if (err) throw err;
        
        return res
            .status(200)       // even though just 1 project, return as array
            .json([project]);  // so view can loop through to build the table.
        
    });
    
});


/* ============================ SECURED ROUTES ============================= */

// TEMP SECURED ROUTE JUST FOR TESTING
routes.get('/api/dashboard', auth, (req, res) => {
    
    console.log('Auth success');
    return res.status(200).json({ message: 'Success!', data: req.token });
    
});


// POST a new project - secured route
routes.post('/api/projects', auth, (req, res) => {
    res.status(200).send(`If you're seeing this, auth worked and you are permitted to POST a new project`);
});


// PUT changes updating an existing project - secured route
routes.put('/api/projects/:id', /*authMiddleware,*/ (req, res) => {
    let project = req.params.id;
    res.status(200).send(`PUT updates project ID: ${project} to /api/projects/:id`);
});


// DELETE an existing project - secured route
routes.delete('/api/projects/:id', /*authMiddleware,*/ (req, res) => {
    let project = req.params.id;
    res.status(200).send(`DELETE project ID: ${project} from /api/projects/:id`);
});


// quickly seed dummy projects in database
routes.get('/api/projects/setup_dummy', (req, res) => {
    
    require('../db/projects').forEach( (proj) => {
        
        var newProj = new Project();
        
        // copy all dyummy object properties to newProj
        for (let prop in proj) {
            newProj[prop] = proj[prop];
        }
        
        // save the new project in database
        newProj.save(function (err) {
            if (err) console.log(err);
            console.log(`Dummy project ${newProj.project_name} saved to db`);
        });
    });
    
    return res.status(200).send('Projects saved.');
    
});


module.exports = routes;
