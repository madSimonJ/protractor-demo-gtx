import instrumentCtrl from './instrumentCtrl';
import instrumentListTemplate from './instruments.pug';

export default app => {
    instrumentCtrl(app);
    app.config(($routeProvider) => {
        $routeProvider.when('/angular1/instruments', {
            template: instrumentListTemplate,
            controller: 'instrumentCtrl'
        });
    });
};