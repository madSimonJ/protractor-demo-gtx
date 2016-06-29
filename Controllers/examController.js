const examRepository = require('../DataAccess/repositories/examRepository');
const pieceRepository = require('../DataAccess/repositories/pieceRepository');
const routeResponses = require('../DataAccess/repositories/routeResponses');
const q = require('q');
const _ = require('lodash');

exports.handleExamGetRequest = (req, res) => {
  let query = {
    board: req.params.board,
    instrument: req.params.instrument,
    grade: req.params.grade
  };

  let deferred = q.defer();
  let queryIsValid = true;
  if (!query.board) {
    deferred.reject(new Error('There was an issue with the parameters supplied: no board was specified'));
    queryIsValid = false;
  } else if (!query.instrument) {
    deferred.reject(new Error('There was an issue with the parameters supplied: no instrument was specified'));
    queryIsValid = false;
  } else if (!query.grade) {
    deferred.reject(new Error('There was an issue with the parameters supplied: no grade was specified'));
    queryIsValid = false;
  } else if (!_.isNumber(query.grade)) {
    deferred.reject(new Error('There was an issue with the parameters supplied: the specified grade was not a number'));
    queryIsValid = false;
  }

  if (queryIsValid) {
    examRepository.getExams(query)
      .then(data => {
        let examData = data;
        let listOfIds = _.union(data.lists.A, data.lists.B, data.lists.C);
        pieceRepository.getPieceList(listOfIds);
          .then(data => {
            let pieceData = data;
            examData.lists.A = joinObjectResults(examData.lists.A, pieceData);
            examData.lists.B = joinObjectResults(examData.lists.B, pieceData);
            examData.lists.C = joinObjectResults(examData.lists.C, pieceData);
            deferred.resolve(examData);
          })
          .catch(error => {
            deferred.reject(`An error occured getting piece data: ${error.message}`);
          });
      })
      .catch(error => {
        deferred.reject(`An error occured getting exam data: ${error.message}`);
      })
  }

  routeResponses.SendDocumentIfFound(req, res, deferred.promise);
}

const joinObjectResults = (list, pieceRecords) => {
  return _.map(list, pieceId => {
    let relatedPieceRecord = _.find(pieceRecords, pieceRecord => {
      return pieceRecord._id == pieceId;
    });
    relatedPieceRecord.pieceId = pieceId;
    return _.omit(relatedPieceRecord, '_id');
  });
}
