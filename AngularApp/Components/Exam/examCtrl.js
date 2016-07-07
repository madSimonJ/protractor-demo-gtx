export default app => {
  
app.controller('examCtrl', ($scope, examFactory, $routeParams) => {
  $scope.SelectedInstrument = $routeParams.instrument;
  $scope.SelectedGrade = $routeParams.grade;
  $scope.SelectedBoard = $routeParams.board;
  let queryParameters = {};

  if(!!$scope.SelectedBoard) {
    queryParameters.board = $scope.SelectedBoard;
  }

  if (!!$scope.SelectedInstrument) {
    queryParameters.instrument = $scope.SelectedInstrument;
  }

  if(!!$scope.SelectedGrade) {
    queryParameters.grade = $scope.SelectedGrade;
  }

  $scope.Exams = examFactory.query(queryParameters);
  
});
    
};
