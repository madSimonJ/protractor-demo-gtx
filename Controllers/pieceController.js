const pieceRepository = require('../DataAccess/repositories/pieceRepository');
const routeResponses = require('../routes/repositories/routeResponses');

exports.handlePieceGetRequest = (req, res) => {
  let query = {
    pieceid: req.params.pieceid
  };
  routeResponses.SendDocumentIfFound(req, res, pieceRepository.getPieces(query));
}
