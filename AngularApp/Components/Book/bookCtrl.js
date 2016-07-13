export default app => {

    app.controller('bookCtrl', ($scope, bookFactory, $routeParams) => {
      $scope.Books = [];
      $scope.Book = {
        title: 'Book not Found'
      };
      if (!!$routeParams.isbn) {
        $scope.Book = bookFactory.get({isbn: $routeParams.isbn});
      } else {
        $scope.Books = bookFactory.query();
      }
    });
};


