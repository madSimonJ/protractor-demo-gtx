import chai from 'chai';
import mockery from 'mockery';
import {sandbox} from 'sinon';

import createExpressStubs from '../../stubs/expressStubs';

chai.should();

let examControllerStub = {'handleExamGetRequest': {identity: 'examControllerStub'}};
let bookControllerStub = {'handleBookGetRequest': {identity: 'bookControllerStub'}};
let pieceControllerStub = {'handlePieceGetRequest': {identity: 'pieceControllerStub'}};
let stubRouteResponses = {
    SendFileNotFoundResponse: {
        identity: 'SendFileNotFoundResponseMock'
    }
}
let expressStubs = createExpressStubs(sandbox);

describe('The Express app configureApiRoutes module', () => {
   
    describe('given an instance of Express', () => {
       
        let configureApiRoutesModule;
        
        before(() => {
            mockery.enable({
                warnOnReplace: false,
                warnOnUnregistered: false
            });
            mockery.registerMock('../../Controllers/examController', examControllerStub);
            mockery.registerMock('../../Controllers/bookController', bookControllerStub);
            mockery.registerMock('../../Controllers/pieceController', pieceControllerStub);
            mockery.registerMock('./routeResponses', stubRouteResponses);
            mockery.registerAllowable('../../../ExpressApp/Routes/configureApiRoutes');
            configureApiRoutesModule = require('../../../ExpressApp/Routes/configureApiRoutes');
            configureApiRoutesModule(expressStubs.expressAppStub);
        });
        
        after(() => {
            mockery.disable();
            sandbox.verifyAndRestore();
            sandbox.reset();
            mockery.deregisterAll();
        });
        
        describe('when configuring API routes', () => {
            
            it('should configure a set of Get routes', () => {
                let appGetCallCount = expressStubs.expressAppStub.get.callCount;
                appGetCallCount.should.equal(3);
            });
            
            it('should configure an exam route', () => {
                let firstCallToAppGet =  expressStubs.expressAppStub.get.firstCall;
                let firstRouteConfigured = firstCallToAppGet.args[0];
                firstRouteConfigured.should.equal('/api/exams/:board?/:instrument?/:grade?');
            });
            
            it('should configure the exam route to call the Exam Controller', () => {
                let firstCallToAppGet =  expressStubs.expressAppStub.get.firstCall;
                let controllerForExamRoute = firstCallToAppGet.args[1];
                controllerForExamRoute.identity.should.equal('examControllerStub');
            });
            
            it('should configure a book route', () => {
                let secondCallToAppGet =  expressStubs.expressAppStub.get.secondCall;
                let secondRouteConfigured = secondCallToAppGet.args[0];
                secondRouteConfigured.should.equal('/api/books/:isbn?');
            });
            
            it('should configure the exam route to call the Exam Controller', () => {
                let secondCallToAppGet =  expressStubs.expressAppStub.get.secondCall;
                let controllerForBookRoute = secondCallToAppGet.args[1];
                controllerForBookRoute.identity.should.equal('bookControllerStub');
            });
            
            it('should configure a piece route', () => {
                let thirdCallToAppGet =  expressStubs.expressAppStub.get.thirdCall;
                let thirdRouteConfigured = thirdCallToAppGet.args[0];
                thirdRouteConfigured.should.equal('/api/pieces/:pieceId?');
            });
            
            it('should configure the exam route to call the Piece Controller', () => {
                let thirdCallToAppGet =  expressStubs.expressAppStub.get.thirdCall;
                let controllerForPieceRoute = thirdCallToAppGet.args[1];
                controllerForPieceRoute.identity.should.equal('pieceControllerStub');
            });
            
            it('should create a single route that matches all verbs', () => {
               let appAllCalledOnce = expressStubs.expressAppStub.all.calledOnce;
                appAllCalledOnce.should.be.true;
            });
            
            it('should configure the all verb route to match all unknown api calls', () => {
                let callToAppAll = expressStubs.expressAppStub.all.firstCall;
                let fallbackApiRoute = callToAppAll.args[0];
                fallbackApiRoute.should.equal('/api/*');
            });
            
            it('should configure the route for all unknown api calls to send a FileNotFound response', () => {
                let callToAppAll = expressStubs.expressAppStub.all.firstCall;
                let configuredRouteHandler = callToAppAll.args[1];
                configuredRouteHandler.identity = 'SendFileNotFoundResponseMock';
            });
        });
    });
});