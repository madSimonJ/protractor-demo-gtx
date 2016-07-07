const db = require('../mongoDBConnector');
const routeResponses = require('../../ExpressApp/Routes/routeResponses');
const Q = require('q');
const _ = require('lodash');

const examCollectionName = 'exam';

const assembleQuery = (board, instrument, grade) => {
  var query = {};

  if (!!board) {
    query.examBoard = board;
  }

  if (!!instrument) {
    query.instrument = instrument.toLowerCase();
  }

  if (!!grade) {
    if(Array.isArray(grade)) {
      query.grade = {$in: grade};
    } else {
      query.grade = grade;
    }
  }

  return query;
};

exports.getExams = searchParameters => {

  if(!searchParameters) {
    searchParameters = {};
  }
  let board = searchParameters.board;
  let instrument = searchParameters.instrument;
  let grade = searchParameters.grade;

  if(!!board && typeof board !== 'string') {
    throw new Error('the Exam Board provided was not a valid string');
  } else if(!!instrument && typeof instrument !== 'string') {
    throw new Error('the instrument provided was not a valid string');
  } else if(!!grade && isNaN(grade) && !Array.isArray(grade)) {
    throw new Error('the grade provided was not a valid integer');
  } else if(!!grade && Array.isArray(grade)) {
    _.each(grade, g => {
      if(isNaN(g)) {
        throw new Error('one or more of the grades provided was not a valid integer');
      }
    });
  }


  let deferred = Q.defer();
  let query = assembleQuery(board, instrument,grade);
  db.Find(examCollectionName, query)
    .then(data => {
      deferred.resolve(data);
    })
    .catch(error => {
      deferred.reject(new Error(`There was an error getting the requested Exam data: ${error.message}`));
    });
  return deferred.promise;
};