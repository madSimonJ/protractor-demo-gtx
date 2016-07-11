const bookRepository = require('../DataAccess/repositories/bookRepository');
const pieceRepository = require('../DataAccess/repositories/pieceRepository');
const routeResponses = require('../ExpressApp/Routes/routeResponses');
const _ = require('lodash');
const q = require('q');

const joinObjectResults = (bookRecord, pieceRecords) => {
  return _.map(bookRecord.piecesInBook, pieceInBook => {
    let relatedPieceRecord = _.find(pieceRecords, pieceRecord => {
      return pieceRecord._id === pieceInBook.piece_id;
    });
    let extendedPieceInBook = _.extend(pieceInBook, relatedPieceRecord);
    return _.omit(extendedPieceInBook, '_id');
  });
};

const getBookDetail = (bookRecord, callbackFunction) => {
    let pieceIdList = _.map(bookRecord.piecesInBook, value => {
        return value.piece_id;
      });
    
      pieceRepository.getPieceList(pieceIdList)
        .then(data => {
          let pieceRecords = data;
          let joinedData = joinObjectResults(bookRecord, pieceRecords);
          bookRecord.piecesInBook = joinedData;
          callbackFunction(bookRecord, null);
        })
        .catch(error => {
          callbackFunction(null, `An error occured fetching details of the Book\'s pieces: "${error.message}"`);
        });
};


exports.handleBookGetRequest = (req, res) => {
  let query = {
    isbn: req.params.isbn
  };

  let deferred = q.defer();
  let bookRecord;
  bookRepository.getBooks(query)
    .then(data => {
      bookRecord = data;
      if(!!query.isbn) {
          getBookDetail(bookRecord, (detailedRecord, err) => {
              if(!!err) {
                  deferred.reject(err);
              } else {
                  deferred.resolve(detailedRecord);
              }
          });
      } else {
          let simplifiedBookList = _.map(bookRecord, book=> {
             book.numberOfPieces = book.piecesInBook.length;
             book = _.omit(book, 'piecesInBook');
            return book;
          });
          deferred.resolve(simplifiedBookList);
      }
    })
    .catch(error => {
      deferred.reject(`An error occured fetching details of the Book: "${error.message}"`);
    });
    
  routeResponses.SendDocumentIfFound(req, res, deferred.promise);
};
