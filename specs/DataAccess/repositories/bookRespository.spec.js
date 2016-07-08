import chai from 'chai';
import mockery from 'mockery';
import {sandbox} from 'sinon';

import createExpressStubs from '../stubs/expressStubs';
import mockEnvs from '../stubs/mockEnvs';

chai.should();

describe('The DataAccess bookRepository module', () => {
    
   describe('given a search parameter set with a valid ISBN number', () => {
      
       let bookRepositoryModule;
       
       before(() => {
            mockery.enable({
                warnOnReplace: false,
                warnOnUnregistered: false
            });
            mockery.registerMock('../mongoDBConnector');
            mockery.registerMock('../../ExpressApp/Routes/routeResponses');
            mockery.registerAllowable('q');
            bookRepositoryModule = require('../../DataAccess/bookRepository');
       });
       
        after(() => {
            mockery.disable();
            sandbox.verifyAndRestore();
            sandbox.reset();
            mockery.deregisterAll();
        });
       
       describe('when getting details of the book', () => {
          
           const isbnToQuery = '9781848494923';
           
           before(() => {
               bookRepositoryModule.getBooks({'isbn': isbnToQuery})
                .then(data => {
                   
               });
               
           });
           
           
           
       });
       
   });
    
});