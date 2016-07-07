import pieceCtrl from './pieceCtrl';
import pieceFactory from './pieceFactory';
import pieceDetailsTemplate from './pieceDetails.pug';
import pieceListTemplate from './pieces.pug';

export default app => {
    pieceFactory(app);
    pieceCtrl(app);
    
    app.config(($routeProvider) => {
       
        $routeProvider.when('/angular1/pieces', {
          template: pieceListTemplate,
          controller: 'pieceCtrl'
        });

      $routeProvider.when('/angular1/pieces/:pieceId', {
        template: pieceDetailsTemplate,
        controller: 'pieceCtrl'
      });
    });
};