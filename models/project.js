/* jshint esversion:6, node: true */

/*
   defines schema and model for projects
*/

'use strict';

const mongoose = require('mongoose'),
      
      projectSchema = new mongoose.Schema({
          cohort: {
              type     : String,
              required : true,
              trim     : true
          },
          team_name: {
              type     : String,
              required : true,
              trim     : true
          },
          project_name: {
              type     : String,
              required : true,
              trim     : true
          },
          repo: {
              type     : String,
              required : true,
              trim     : true
          },
          demo: {
              type     : String,
              trim     : true
          },
          createdByUserId: {
              type     : String,
              required : true,
              trim     : true
          }
      });


/* ================================ EXPORT ================================= */

module.exports = mongoose.model('Project', projectSchema);
