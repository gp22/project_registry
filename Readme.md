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

The API might look like:

```
app.get('/api/projects', ...)                        // GET all projects - public route
app.get('/api/projects/id', ...)                     // GET one project - public route

app.post('/api/projects', authMiddleware, ...)       // POST a new project - secured route
app.put('/api/projects/id', authMiddleware, ...)     // PUT changes updating an existing project - secured route
app.delete('/api/projects/id', authMiddleware, ...)  // DELETE an existing project - secured route
```
