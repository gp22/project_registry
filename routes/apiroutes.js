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

const routes   = require('express').Router(),
      jwt      = require('express-jwt'),
      Project  = require('../models/project'),
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
    
    // Build new project object from req.body data
    // and the `_id` of the user who made the request.
    // We get `_id` from `auth` middleware which returns token object
    let newProject = {
        cohort          : req.body.cohort,
        team_name       : req.body.team_name,
        project_name    : req.body.project_name,
        repo            : req.body.repo,
        demo            : req.body.demo,
        createdByUserId : req.token._id
    };
    
    // First check to see if project already exists
    Project
        .findOne({
            cohort       : req.body.cohort,
            team_name    : req.body.team_name,
            project_name : req.body.project_name
        })
        .exec()
        .then( (project) =>  {
        
            if (!project) {
                
                Project.create(newProject, (err, proj) => {
                    return res.status(200).json({
                        message : 'New project created',
                        project : proj
                    });
                });                
                
            } else {
                return res.status(400).json({
                    message: 'Error - project already exists'
                });
            }

        })
        .catch( (err) => console.log('Error!!!', err));
    
});


// PUT changes updating an existing project - secured route
routes.put('/api/projects/:id', auth, (req, res) => {
    
    // Target the project with matching `_id` and
    // the ID of the user who made the request.
    // We get `createdByUserId` from `auth` middleware which
    // returns a token object
    const target = {
            _id             : req.params.id,
            createdByUserId : req.token._id
        },
        updates = {
            cohort          : req.body.cohort,
            team_name       : req.body.team_name,
            project_name    : req.body.project_name,
            repo            : req.body.repo,
            demo            : req.body.demo,
            createdByUserId : req.token._id
        },
        options = {
            new: true
        };
    
    Project.findOneAndUpdate(target, updates, options)
        .exec()
        .then( (pr) => {
        
            if (!pr) {
                return res.status(404).json({
                    message: 'Error - project not found'
                });
            } else {
                return res.status(200).json({
                    message: `Project updated: ${pr.cohort} / ${pr.team_name} / ${pr.project_name}`,
                    project: pr});
            }
        })
        .catch( (err) => console.log('Error!!!', err));
    
});


// DELETE an existing project - secured route
routes.delete('/api/projects/:id', auth, (req, res) => {
    
    // Target the project with matching `_id` and
    // the ID of the user who made the request.
    // We get `createdByUserId` from `auth` middleware which
    // returns a token object
    let target = {
        _id             : req.params.id,
        createdByUserId : req.token._id
    };
    
    Project.findOneAndRemove(target)
        .exec()
        .then( (pr) => {
        
            if (!pr) {
                return res.status(404).json({
                    message: 'Error - project not found'
                });
            } else {
                
                return res.status(200).json({
                    message: `Project deleted: ${pr.cohort} / ${pr.team_name} / ${pr.project_name}`,
                    project: pr});

            }
        
        })
        .catch( (err) => console.log('Error!!!', err));
    
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
