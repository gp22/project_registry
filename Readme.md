# Chingu Cohort Build-to-Learn Project Registry

**What is this?**

A MEAN app that cohort teams can use to register their projects. So other cohort members can see them and share their own. It would render tabular data fetched from our Node/Express/Mongo backend:

```
Cohort         Team Name              Project              Repo                 Live Demo
----------------------------------------------------------------------------------------------------
Meerkats       General Meerkats       Momentum Clone       github.com/asdf      asdf.github.io/etc
Meerkats       Other Meerkats         Momentum Clone       github.com/ghjk      ghjk.github.io/mmtm
Penguins       Hairy Team Yeah        Penguin Bot          github.com/pgnbt     pgnbt.github.ion/bot
```

**The Node back-end**

The general idea:

1.  Node/Express serves our Angular 2 front-end single-page app to clients,
2.  Node/Express also exposes a series of RESTful API routes / end-points that our front-end consumes,
3.  Most of the 'business logic' (filtering, etc) resides in the SPA front-end.

To use locally:

1.  clone this repo:

    (ssh) `git clone git@github.com:ngChingu/project_registry.git`
    
    (https) `git clone https://github.com/ngChingu/project_registry.git`

2.  install dependencies:

    `npm install`

3.  run:

    `node server.js`

Now you can interact with it using [Postman](https://www.getpostman.com/), by sending http requests:
```
   GET  >>  localhost:3000/api/projects     >> return all projects
   GET  >>  localhost:3000/api/projects/id  >> return project with matching ID
  POST  >>  localhost:3000/api/projects     >> add new project
   PUT  >>  localhost:3000/api/projects/id  >> update project with matching ID
DELETE  >>  localhost:3000/api/projects/id  >> delete project with matching ID
```

You can also write the above API calls in your Angular front-end.
