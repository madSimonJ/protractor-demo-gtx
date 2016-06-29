const express = require('express');
const middlewareConfig = require('./ExpressApp/middlewareConfig');

let app = express();

const environmentVariables = require('./server/config/environmentVariablesConfig')[env]
middlewareConfig(app, environmentVariables);

app.get('*', (req, res) => {
    res.sendStatus(200);
});

app.listen(8080);