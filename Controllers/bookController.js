const bookRepository = require('../DataAccess/repositories/bookRepository');
const pieceRepository = require('../DataAccess/repositories/pieceRepository');
const routeResponses = require('../DataAccess/repositories/routeResponses');
const _ = require('lodash');
const q = require('q');

exports.handleBookGetRequest = (req, res) => {
  let query = {
    isbn: req.params.isbn
  };

  let deferred = q.defer();
  let bookRecord;
  let pieceRecords;
  bookRepository.getBooks(query)
    .then(data => {
      bookRecord = data;
      let pieceIdList = _.map(bookRecord.piecesInBook, (value, index) => {
        return value.piece_id;
      });
      pieceRepository.getPieceList(pieceIdList)
        .then(data => {
          pieceRecords = data;
          let joinedData = joinObjectResults(bookRecord, pieceRecords);
          bookRecord.piecesInBook = joinedData;
          deferred.resolve(bookRecord)
        })
        .catch(error => {
          deferred.reject(`An error occured fetching details of the Book\'s pieces: "${error.message}"`);
        });
    })
    .catch(error => {
      deferred.reject(`An error occured fetching details of the Book: "${error.message}"`);
    });
  routeResponses.SendDocumentIfFound(req, res, deferred.promise);
}

const joinObjectResults = (bookRecord, pieceRecords) => {
  return _.map(bookRecord.piecesInBook, pieceInBook => {
    let relatedPieceRecord = _.find(pieceRecords, pieceRecord => {
      return pieceRecord._id == pieceInBook.piece_id;
    });
    let extendedPieceInBook = _.extend(pieceInBook, relatedPieceRecord);
    return _.omit(extendedPieceInBook, '_id');
  });
}
