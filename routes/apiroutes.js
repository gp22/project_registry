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

// const Projects = require('../models/projects');  // uncomment once db exists

module.exports = function (app) {
    
    // GET all projects - public route
    app.get('/api/projects', (req, res) => {
        res.status(200).send(`GET all projects from /api/projects`);
    });

    
    // GET one project - public route
    app.get('/api/projects/:id', (req, res) => {
        let project = req.params.id;
        res.status(200).send(`GET project ID: ${project} from /api/projects/:id`);
    });

    
    // POST a new project - secured route
    app.post('/api/projects', /*authMiddleware,*/ (req, res) => {
        res.status(200).send(`POST a new project to /api/projects`);
    });
    
    
    // PUT changes updating an existing project - secured route
    app.put('/api/projects/:id', /*authMiddleware,*/ (req, res) => {
        let project = req.params.id;
        res.status(200).send(`PUT updates project ID: ${project} to /api/projects/:id`);
    });
    
    
    // DELETE an existing project - secured route
    app.delete('/api/projects/:id', /*authMiddleware,*/ (req, res) => {
        let project = req.params.id;
        res.status(200).send(`DELETE project ID: ${project} from /api/projects/:id`);
    });    
    
};
