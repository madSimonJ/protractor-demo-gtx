import mockery from 'mockery';
import {sandbox} from 'sinon';

import TestHelper from '../stubs/TestHelper';
import createExpressStubs from '../stubs/expressStubs';
import createRouteResponsesStub from '../stubs/routeResponsesStub';
import BookRepositoryStubCreator from '../stubs/RepositoryStubs/bookRepositoryStub';
import PieceRepositoryStubCreator from '../stubs/RepositoryStubs/pieceRepositoryStub';
import bookControllerHelper from '../stubs/ControllerStubs/bookControllerHelper';

TestHelper.SetUpChai();

let bookControllerSandbox = sandbox.create();

let bookRepositoryStub = BookRepositoryStubCreator.createBookRepositoryStub(bookControllerSandbox);
let pieceRepositoryStub = PieceRepositoryStubCreator.createPieceRepositoryStub(bookControllerSandbox);
let expressStubs = createExpressStubs(bookControllerSandbox);
let routeResponsesStub = createRouteResponsesStub(bookControllerSandbox);

describe('the bookController module', () => {
   
   let bookControllerModule;
    
   before(() => {
        mockery.enable({
            warnOnReplace: false,
            warnOnUnregistered: false
        });
        mockery.registerMock('../DataAccess/repositories/bookRepository', bookRepositoryStub);
        mockery.registerMock('../DataAccess/repositories/pieceRepository', pieceRepositoryStub);
        mockery.registerMock('../ExpressApp/Routes/routeResponses', routeResponsesStub);
        mockery.registerAllowable('q');
        mockery.registerAllowable('lodash');
        mockery.registerAllowable('../../Controllers/bookController');
        bookControllerModule = require('../../Controllers/bookController');
   });

    after(() => {
        TestHelper.DeregisterMocks(mockery, bookControllerSandbox);
    });
    
    describe('given a search parameter set with a valid ISBN number', () => {
        
        
        before(() => {
            let reqStub = expressStubs.reqStub;
            reqStub.params = {
                isbn: BookRepositoryStubCreator.ValidIsbnNumber
            };
            let resStub = expressStubs.resStub;
            bookControllerModule.handleBookGetRequest(reqStub, resStub);
        });
        
        after(() => {
            TestHelper.ResetMocks(bookControllerSandbox);
        });
        
        it('should call the bookRepository', () => {
            bookRepositoryStub.getBooks.should.have.been.calledOnce;
        });
        
        it('should query the bookRepository for the requested ISBN', () => {
           bookRepositoryStub.getBooks.should.have.been.calledWith(BookRepositoryStubCreator.expectedValidQuery);
        });
        
        it('should query the pieceRepository', () => {
           pieceRepositoryStub.getPieceList.should.have.been.calledOnce; 
        });
        
        it('should request details of all of the pieces associated with the requested book', () => {
            pieceRepositoryStub.getPieceList.should.have.been.calledWith(PieceRepositoryStubCreator.expectedPieceQuery);
        });
        
        it('should call the sendFileIfFound function on the routeReponses module', () => {
            routeResponsesStub.SendDocumentIfFound.should.have.beenCalled;
        });
        
        it('should forward on the request object', () =>{
            let firstCallToSendDocumentFunction = routeResponsesStub.SendDocumentIfFound.firstCall;
            let argParameterPassed = firstCallToSendDocumentFunction.args[0];
            argParameterPassed.identity.should.equal('reqStub');
        });
        
        it('should forward on the response object', () =>{
            let firstCallToSendDocumentFunction = routeResponsesStub.SendDocumentIfFound.firstCall;
            let argParameterPassed = firstCallToSendDocumentFunction.args[1];
            argParameterPassed.identity.should.equal('resStub');
        });
        
        it('should pass on a resolving promise which is fulfilled', ()=> {
            let firstCallToSendDocumentFunction = routeResponsesStub.SendDocumentIfFound.firstCall;
            let promiseParameterPassed = firstCallToSendDocumentFunction.args[2];
            return promiseParameterPassed.should.be.fulfilled;
        });
        
        it('should return a promise that resolves to a merged data set containing book and piece data', () => {
            let firstCallToSendDocumentFunction = routeResponsesStub.SendDocumentIfFound.firstCall;
            let promiseParameterPassed = firstCallToSendDocumentFunction.args[2];
            return promiseParameterPassed.should.eventually.eql(bookControllerHelper.expectedMergedBookData);
        });
    });
});