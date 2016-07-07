import mainCtrl from './mainCtrl';
import mainTemplate from './main.pug';

export default app => {
    mainCtrl(app);
    
    app.config(($routeProvider) => {
       
      $routeProvider.when('/angular1', {
        template: mainTemplate,
        controller: 'mainCtrl'
      });
    });
};