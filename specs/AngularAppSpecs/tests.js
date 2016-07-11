//require('angular/angular');

import {sandbox} from 'sinon';
import chai from 'chai';
chai.should();


const componentsContext = require.context('../../AngularApp/Components', true, /index\.js$/);

componentsContext.keys().forEach(componentsContext);

//global.angular = window.angular;
//require('angular-mocks');
//global.inject = global.angular.mock.inject;
//global.ngModule = global.angular.mock.module;

const testsContext = require.context('./componentSpecs/', true, /\.js$/);

testsContext.keys().forEach(testsContext);

