import TestHelper from '../../stubs/TestHelper';
import mockery from 'mockery';
import {sandbox} from 'sinon';

import createExpressStubs from '../../stubs/expressStubs';

TestHelper.SetUpChai();

let examControllerStub = {'handleExamGetRequest': {identity: 'examControllerStub'}};
let bookControllerStub = {'handleBookGetRequest': {identity: 'bookControllerStub'}};
let pieceControllerStub = {'handlePieceGetRequest': {identity: 'pieceControllerStub'}};
let stubRouteResponses = {
    SendFileNotFoundResponse: {
        identity: 'SendFileNotFoundResponseMock'
    }
}
let apiRouteSandbox = sandbox.create();
let expressStubs = createExpressStubs(apiRouteSandbox);

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
            TestHelper.DeregisterMocks(mockery, apiRouteSandbox);
        });
        
        describe('when configuring API routes', () => {
            
            const examRoute = '/api/exams/:board?/:instrument?/:grade?';
            const bookRoute = '/api/books/:isbn?';
            const pieceRoute = '/api/pieces/:pieceId?';
            const defaultRoute = '/api/*';
            
            it('should configure a set of Get routes', () => {
                expressStubs.expressAppStub.get.should.have.been.calledThrice;
            });
            
            it('should configure an exam route', () => {
                expressStubs.expressAppStub.get.firstCall.should.have.been.calledWith(examRoute);
            });
            
            it('should configure the exam route to call the Exam Controller', () => {
                let firstCallToAppGet =  expressStubs.expressAppStub.get.firstCall;
                let controllerForExamRoute = firstCallToAppGet.args[1];
                controllerForExamRoute.identity.should.equal('examControllerStub');
            });
            
            it('should configure a book route', () => {
                expressStubs.expressAppStub.get.secondCall.should.have.been.calledWith(bookRoute);
            });
            
            it('should configure the exam route to call the Exam Controller', () => {
                let secondCallToAppGet =  expressStubs.expressAppStub.get.secondCall;
                let controllerForBookRoute = secondCallToAppGet.args[1];
                controllerForBookRoute.identity.should.equal('bookControllerStub');
            });
            
            it('should configure a piece route', () => {
                expressStubs.expressAppStub.get.thirdCall.should.have.been.calledWith(pieceRoute);
            });
            
            it('should configure the exam route to call the Piece Controller', () => {
                let thirdCallToAppGet =  expressStubs.expressAppStub.get.thirdCall;
                let controllerForPieceRoute = thirdCallToAppGet.args[1];
                controllerForPieceRoute.identity.should.equal('pieceControllerStub');
            });
            
            it('should create a single route that matches all verbs', () => {
                expressStubs.expressAppStub.all.should.have.been.calledOnce;
            });
            
            it('should configure the all verb route to match all unknown api calls', () => {
                expressStubs.expressAppStub.all.should.have.been.calledWith(defaultRoute);
            });
            
            it('should configure the route for all unknown api calls to send a FileNotFound response', () => {
                let callToAppAll = expressStubs.expressAppStub.all.firstCall;
                let configuredRouteHandler = callToAppAll.args[1];
                configuredRouteHandler.identity = 'SendFileNotFoundResponseMock';
            });
        });
    });
});