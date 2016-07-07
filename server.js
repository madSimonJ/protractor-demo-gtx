const env = 'development';

const environmentVariables = require('./environmentVariables')[env];
const expressAppConfiguration = require('./ExpressApp/createExpressApp');

console.log('');
console.log('Configuring database connection');
const dbConfig = require('./DataAccess/mongoDBConnector');
dbConfig.connect(environmentVariables);
console.log('database configured');

let app = expressAppConfiguration.SetUp(environmentVariables);
expressAppConfiguration.Start(app);

