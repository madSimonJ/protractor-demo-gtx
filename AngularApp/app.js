import angular from 'angular';

import uiRouter from 'angular-route';
import ngResource from 'angular-resource';

import main from './Components/Main';
import exam from './Components/Exam';
import instrument from './Components/Instrument';
import book from './Components/Book';
import piece from './Components/Piece';

let app = angular.module('ductia', [uiRouter, ngResource]);
app.config(($routeProvider, $locationProvider) => {
    "use strict";
    
    $locationProvider.html5Mode({
    enabled: true,
    requireBase: false
  });
});

main(app);
exam(app);
instrument(app);
book(app);
piece(app);
