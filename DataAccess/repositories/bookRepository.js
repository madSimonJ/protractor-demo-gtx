const db = require('../mongoDBConnector');
const q = require('q');

const bookCollectionName = 'book';

const assembleQuery = searchParameters => {
  let returnValue = {};
  if((!!searchParameters) && (!!searchParameters.isbn)) {
      returnValue._id = searchParameters.isbn;
  }
  return returnValue;
};

exports.getBooks = searchParameters => {

  let deferred = q.defer();
  
  let parametersAreValid = true;
    
  if((!!searchParameters) && (!!searchParameters.isbn) && (typeof searchParameters.isbn !== 'string')) {
      deferred.reject(new Error('The ISBN number provided was not a valid string'));
      parametersAreValid = false;
  }
    
  if(parametersAreValid) {    
    
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
  }
    return deferred.promise;
};
