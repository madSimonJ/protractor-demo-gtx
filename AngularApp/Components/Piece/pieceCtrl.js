export default app => {
    
    app.controller('pieceCtrl', ($scope, $routeParams, pieceFactory) => {
      $scope.Piece = {title: 'piece not found'};
      $scope.Pieces = [];

      if(!!$routeParams.pieceId) {
        $scope.Piece = pieceFactory.get({pieceId: $routeParams.pieceId});
      } else {
        $scope.Pieces = pieceFactory.query({});
      }
    });

};


