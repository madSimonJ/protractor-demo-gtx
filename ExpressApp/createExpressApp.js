const express = require('express');
const middlewareConfig = require('./configureMiddleware');
const routeConfig = require('./Routes/configureApiRoutes');
const dbConfig = require('../DataAccess/mongoDBConnector');

var env;

module.exports.SetUp = environmentVariables => {
   
    let app = express();
    env = environmentVariables;
    middlewareConfig(app, env);
    
    routeConfig.ConfigureApiRoutes(app);
    
    app.get('*', (req, res) => {
        res.sendStatus(200);
    });    
    
    return app;
}

module.exports.Start = app => {
    
    dbConfig.connect(env);
    app.listen(8080);
}