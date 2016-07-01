const env = 'dev';

const environmentVariables = require('./environmentVariables')[env];
const expressAppConfiguration = require('./ExpressApp/createExpressApp');

let app = expressAppConfiguration.SetUp(environmentVariables);
expressAppConfiguration.Start(app);

