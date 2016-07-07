import bookCtrl from './bookCtrl';
import bookFactory from './bookFactory';
import bookDetailsTemplate from './bookDetails.pug';
import bookListTemplate from './books.pug';

export default app => {
    bookFactory(app);
    bookCtrl(app);
    
    app.config(($routeProvider) => {
       
      $routeProvider.when('/angular1/books/:isbn', {
        template: bookDetailsTemplate,
        controller: 'bookCtrl'
      });

      $routeProvider.when('/angular1/books', {
        template: bookListTemplate,
        controller: 'bookCtrl'
      });
    });
};