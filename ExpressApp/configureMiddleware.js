const morgan = require('morgan');

module.exports = (app, environmentVariables) => {
    app.use(morgan('dev'));
};
