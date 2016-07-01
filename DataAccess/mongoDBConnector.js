const MongoClient = require('mongodb').MongoClient;
const testDataSeeder = require('./testDataSeeder');
const Q = require('q');
var databaseConnection = undefined;

exports.connect = config => {
console.log(config);
  if (!!config) {
    if (!!config.db) {
      MongoClient.connect(config.db, (err, db) => {
        if (!!err) {
          console.log(`error connecting to database: ${err}`);
        } else {
          databaseConnection = db;
          console.log('database connected');
          if (config.reseedDBOnServerRestart === true) {
            testDataSeeder.reseedDatabase(databaseConnection);
          }
        }
      });
    } else {
      throw new Error('The provided Configuration parameter object did not contain the required "db" property')
    }
  } else {
    throw new Error('No configuration parameter object was provided');
  }
}

exports.disconnect = () => {
  if (!!databaseConnection) {
    MongoClient.close();
    databaseConnection = undefined;
  }
}

exports.DatabaseConnection = () => {
  if (!!databaseConnection) {
    return databaseConnection;
  } else {
    throw new Error('the database is not connected');
  }
}

exports.FindOne = (collectionName, query) => {

  let validationErrorMessage = validateQueryParameters(collectionName, query);
  if (validationErrorMessage !== '') {
    throw new Error(validationErrorMessage);
  }

  let deferred = Q.defer();

  databaseConnection.collection(collectionName).findOne(query, (err, record) => {
    if (!!err) {
      deferred.reject(new Error(`error getting record from database: ${err}`));
    } else {
      deferred.resolve(record);
    }
  });
  return deferred.promise;
}


exports.Find = (collectionName, query) => {

  let validationErrorMessage = validateQueryParameters(collectionName, query);
  if (validationErrorMessage !== '') {
    throw new Error(validationErrorMessage);
  }

  let deferred = Q.defer();
  let returnDocs = new Array();
  let cursor = databaseConnection.collection(collectionName).find(query);
  cursor.each(function(err, doc) {
    if (!!err) {
      deferred.reject(new Error(`error reading record: ${Err}`));
    } else {
      if (doc !== null) {
        returnDocs.push(doc);
      } else {
        deferred.resolve(returnDocs);
      }
    }

  });

  return deferred.promise;
}

const validateQueryParameters = (collectionName, query) => {
  let errorMessageReturnValue = '';

  if (!collectionName && !query) {
    errorMessageReturnValue = 'No parameters have been specified';
  } else if (!!collectionName && !query) {
    errorMessageReturnValue = 'No query was passed as a parameter';
  } else if (!collectionName && !!query) {
    errorMessageReturnValue = 'A query has been defined, but there is no collection name';
  } else if (typeof collectionName !== 'string') {
    errorMessageReturnValue = 'The collectionName parameter was not a valid String';
  }

  return errorMessageReturnValue;
}
