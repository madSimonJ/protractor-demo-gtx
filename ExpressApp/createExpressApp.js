const express = require('express');
const middlewareConfig = require('./configureMiddleware');
const ConfigureApiRoutes = require('./Routes/configureApiRoutes');
const ConfigureAngular1Routes = require('./Routes/configureRoutes');
const dbConfig = require('../DataAccess/mongoDBConnector');

var env;

module.exports.SetUp = environmentVariables => {
   
    let app = express();
    env = environmentVariables;
    middlewareConfig(app, env);
    
    ConfigureApiRoutes(app);
    ConfigureAngular1Routes(app);
    app.get('*', (req, res) => {
        res.sendStatus(404);
    });    
    
    return app;
};

module.exports.Start = app => {
    
    dbConfig.connect(env);
    app.listen(8080);
};