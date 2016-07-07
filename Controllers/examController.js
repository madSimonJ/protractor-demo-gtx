const examRepository = require('../DataAccess/repositories/examRepository');
const pieceRepository = require('../DataAccess/repositories/pieceRepository');
const routeResponses = require('../ExpressApp/Routes/routeResponses');
const q = require('q');
const _ = require('lodash');


const joinObjectResults = (list, pieceRecords) => {
  return _.map(list, pieceId => {
    let relatedPieceRecord = _.find(pieceRecords, pieceRecord => {
      return pieceRecord._id === pieceId;
    });
    relatedPieceRecord.pieceId = pieceId;
    return _.omit(relatedPieceRecord, '_id');
  });
};

exports.handleExamGetRequest = (req, res) => {
    console.log('handling exam request...');
  let query = {
    board: req.params.board,
    instrument: req.params.instrument,
    grade: req.params.grade
  };

  let deferred = q.defer();
  let queryIsValid = true;

    if (!!query.grade && !_.isNumber(parseInt(query.grade))) {
    deferred.reject(new Error('There was an issue with the parameters supplied: the specified grade was not a number'));
    queryIsValid = false;
  }

  if (queryIsValid) {
    examRepository.getExams(query)
      .then(data => {
        let examData = data;
        console.log(`data = ${JSON.stringify(data)}`);
        deferred.resolve(examData);
      })
      .catch(error => {
        deferred.reject(`An error occured getting exam data: ${error.message}`);
        console.log(`error2: ${error}`);
      });
  }
            
function getExamDetail(examData, callback) {
    let listOfIds = _.union(examData.lists.A, examData.lists.B, examData.lists.C);
    pieceRepository.getPieceList(listOfIds)
      .then(data => {
        let pieceData = data;
        examData.lists.A = joinObjectResults(examData.lists.A, pieceData);
        examData.lists.B = joinObjectResults(examData.lists.B, pieceData);
        examData.lists.C = joinObjectResults(examData.lists.C, pieceData);
        callback(examData, undefined);
      })
      .catch(error => {
        callback(undefined, `An error occured getting piece data: ${error.message}`);
        console.log(`error: ${error}`);
      });
}

  routeResponses.SendDocumentIfFound(req, res, deferred.promise);
};