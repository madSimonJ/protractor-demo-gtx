const pieceRepository = require('../DataAccess/repositories/pieceRepository');
const routeResponses = require('../ExpressApp/Routes/routeResponses');

exports.handlePieceGetRequest = (req, res) => {
  let query = {
    pieceid: req.params.pieceid
  };
  routeResponses.SendDocumentIfFound(req, res, pieceRepository.getPieces(query));
};
