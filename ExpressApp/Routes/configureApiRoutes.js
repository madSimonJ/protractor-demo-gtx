const examController = require('../../Controllers/examController');
const bookController = require('../../Controllers/bookController');
const pieceController = require('../../Controllers/pieceController');
const routeResponses = require('./routeResponses');

module.exports = app => {
  app.get('/api/exams/:board?/:instrument?/:grade?', examController.handleExamGetRequest);
  app.get('/api/books/:isbn?', bookController.handleBookGetRequest);
  app.get('/api/pieces/:pieceId?', pieceController.handlePieceGetRequest);
  app.all('/api/*', routeResponses.SendFileNotFoundResponse);
};