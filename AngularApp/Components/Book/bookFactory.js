export default app => {

    app.factory('bookFactory', $resource => {
      let examResource = $resource('/api/books/:isbn', {isbn: '@isbn'});
      return examResource;
    });
    
};


