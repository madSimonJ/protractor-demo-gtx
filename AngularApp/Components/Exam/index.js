import examCtrl from './examCtrl';
import examFactory from './examFactory';
import examDetailsTemplate from './examDetails.pug';
import examListTemplate from './examList.pug';

export default app => {
    examFactory(app);
    examCtrl(app);
    
    app.config(($routeProvider) => {
       
      $routeProvider.when('/angular1/exams/:board?/:instrument?/:grade?', {
        template: examListTemplate,
        controller: 'examCtrl'
      });
    });
};