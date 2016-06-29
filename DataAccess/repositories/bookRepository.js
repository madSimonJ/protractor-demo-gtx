const db = require('../config/databaseConfig');
const routeResponses = require('../routes/routeResponses');
const q = require('q');

const bookCollectionName = 'book';

exports.getBooks = searchParameters => {

  if((!!searchParameters) && (!!searchParameters.isbn) && (typeof searchParameters.isbn !== 'string')) {
    throw new Error('The ISBN number provided was not a valid string');
  }

  let deferred = q.defer();
  let query = assembleQuery(searchParameters);
  db.Find(bookCollectionName, query)
    .then(data => {
      let dataToReturn = data;

      if (!!searchParameters.isbn && dataToReturn.length > 0) {
        dataToReturn = dataToReturn[0];
      }
      deferred.resolve(dataToReturn);
    })
    .catch(error => {
      deferred.reject(new Error(`There was an error getting the requested Exam data: ${error.message}`));
    });

    return deferred.promise;
}

const assembleQuery = searchParameters => {
  let returnValue = {};
  if((!!searchParameters) && (!!searchParameters.isbn)) {
      returnValue._id = searchParameters.isbn;
  }
  return returnValue;
}
