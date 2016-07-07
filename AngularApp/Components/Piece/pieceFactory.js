export default app => {
 
    app.factory('pieceFactory', $resource => {
      let pieceResource = $resource('/api/pieces/:pieceId', {pieceId: '@pieceId'});
      return pieceResource;
    });
    
};
