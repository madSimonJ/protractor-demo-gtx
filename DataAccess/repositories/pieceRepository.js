const db = require('../config/databaseConfig');
const routeResponses = require('../routes/routeResponses');
const q = require('q');

const pieceCollectionName = 'piece';

exports.getPieces = searchParameters => {

  if((!!searchParameters) && (!!searchParameters.pieceid) && (typeof searchParameters.pieceid !== "string")) {
    throw new Error('The Piece Id provided was not a valid string');
  }

  let deferred = q.defer();
  let query = assembleSearchQuery(searchParameters);
  db.Find(pieceCollectionName, query)
    .then(data => {
      deferred.resolve(data);
    })
    .catch(error => {
      deferred.reject(new Error(`There was an error getting the requested Piece data: ${error.message}`));
    });

    return deferred.promise;
}

exports.getPieceList = listOfIds => {
  let query = assemblePieceListQuery(listOfIds);
  let deferred = q.defer();
  db.Find(pieceCollectionName, query)
    .then(data => {
      deferred.resolve(data);
    })
    .catch(error => {
      deferred.reject(new Error(`There was an error getting the requested Piece data: ${error.message}`));
    });
    return deferred.promise;
}

const assemblePieceListQuery = listOfIds => {
  let returnValue = {_id: { $in: listOfIds }};
  return returnValue;
}

const assembleSearchQuery = searchParameters => {
  let returnValue = {};
  if((!!searchParameters) && (!!searchParameters.pieceid)) {
      returnValue._id = searchParameters.pieceid;
  }
  return returnValue;
}
