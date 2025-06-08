const express = require("express");
const  athleteRoutes = require('./athlete.routes');
const  clubRoutes = require('./club.routes');
const  bicycleRoutes = require('./bicycle.routes');
const  experienceRoutes = require('./experience.routes');
const  cityRoutes = require('./city.routes');
const  categoryRoutes = require('./category.routes');
const  competitionRoutes = require('./competition.routes');
const participationRoutes =require('./participation.routes');
const hitRoutes = require('./hit.routes');
const stageRoutes = require('./stage.routes');
const penaltyRoutes = require('./penalty.routes');

const roundRoutes = require('./round.routes');
const bodyParser = require('body-parser');
const app = express();

//More about Middlewares
//https://expressjs.com/es/guide/using-middleware.html
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

/**
 * Server will be able to handle
 * request body data by parsing it
 * using JSON syntax.
 * Basically, a server will be
 * able to undestand JSON objects
 */

app.use(athleteRoutes); // Use this router
app.use(clubRoutes);
app.use(bicycleRoutes);
app.use(cityRoutes);
app.use(experienceRoutes);
app.use(categoryRoutes);
app.use(competitionRoutes);
app.use(participationRoutes);
app.use(hitRoutes);
app.use(roundRoutes);
app.use(stageRoutes);
app.use(penaltyRoutes);
//More about routes
//https://expressjs.com/es/guide/routing.html
module.exports= app;
