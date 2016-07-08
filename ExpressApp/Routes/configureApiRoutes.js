var examController = require('../../Controllers/examController');
var bookController = require('../../Controllers/bookController');
var pieceController = require('../../Controllers/pieceController');
var routeResponses = require('./routeResponses');

module.exports = app => {
  app.get('/api/exams/:board?/:instrument?/:grade?', examController.handleExamGetRequest);
  app.get('/api/books/:isbn?', bookController.handleBookGetRequest);
  app.get('/api/pieces/:pieceId?', pieceController.handlePieceGetRequest);
  app.all('/api/*', routeResponses.SendFileNotFoundResponse);
};