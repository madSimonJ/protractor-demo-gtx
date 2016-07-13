import mockery from 'mockery';
import {sandbox} from 'sinon';

import TestHelper from '../../stubs/TestHelper';
import MongoDbStubCreator from '../../stubs/mongoDbStub';
import createRouteResponsesStub from '../../stubs/routeResponsesStub';

TestHelper.SetUpChai();

let bookRepSandbox = sandbox.create();
let routeResponsesStub = createRouteResponsesStub(bookRepSandbox);
let mongoDbStub = MongoDbStubCreator.createMongoDbStub(bookRepSandbox);

describe('The DataAccess bookRepository module', () => {
    
   let bookRepositoryModule;
    
   before(() => {
        mockery.enable({
            warnOnReplace: false,
            warnOnUnregistered: false
        });
        mockery.registerMock('../mongoDBConnector', mongoDbStub);
        mockery.registerMock('../../ExpressApp/Routes/routeResponses', routeResponsesStub);
        mockery.registerAllowable('q');
        mockery.registerAllowable('../../../DataAccess/repositories/bookRepository');
        bookRepositoryModule = require('../../../DataAccess/repositories/bookRepository');
   });

    after(() => {
        TestHelper.DeregisterMocks(mockery, bookRepSandbox);
    });
    
   describe('given a search parameter set with a valid ISBN number', () => {
       
       let validIsbnNumber = MongoDbStubCreator.IsbnThatWillReturnAValidBookResult;
       describe('when getting details of the book', () => {
           
           let bookRepositoryGetBooksPromise;
           
           before(() => {
               let query = {'isbn': validIsbnNumber};
               bookRepositoryGetBooksPromise = bookRepositoryModule.getBooks(query);
           });
           
           after(() => {
               TestHelper.ResetMocks(bookRepSandbox);
           });
           
           it('should return a resolving promise that is fulfilled', () => {
               return bookRepositoryGetBooksPromise.should.be.fulfilled;
           });
           
           it('should return a promise that resolves to the expected book data', () => {
               return bookRepositoryGetBooksPromise.should.eventually.eql(MongoDbStubCreator.validGetBookResult);
           });
           
           it('should query the database', () => {
               mongoDbStub.Find.should.have.been.calledOnce;
           });
           
           it('should assemble a query to search the book collection in the database', () => {
               mongoDbStub.Find.should.have.been.calledWith('book');
           });
           
           it('should assemble a query that searches the book collection using the ISBN provided as an ID', () => {
               mongoDbStub.Find.should.have.been.calledWith('book', MongoDbStubCreator.expectedValidQuery);
           });
       });
   });
    
   describe('given an invalid ISBN number', () => {
      
        let validIsbnNumber = MongoDbStubCreator.IsbnThatIsInvalid;
       
       describe('when getting details of the book', () => {
           
           let bookRepositoryGetBooksPromise;
           
           before(() => {
               bookRepositoryGetBooksPromise = bookRepositoryModule.getBooks({'isbn': validIsbnNumber});
           });
           
           after(() => {
               TestHelper.ResetMocks(bookRepSandbox);
           });
        
           
           it('should return a resolving promise that is rejected', () => {
               return bookRepositoryGetBooksPromise.should.eventually.be.rejected;
           });
           
           it('should be rejected with an appropriate error message', () => {
              return  bookRepositoryGetBooksPromise.should.eventually.be.rejectedWith('The ISBN number provided was not a valid string');
           });
           
           it('should not query the database', () => {
                mongoDbStub.Find.should.have.not.been.called;
           });
       });
   });
    
    describe('given an error occuring in the database', () => {
       
        describe('when getting details of a book', () => {
        
            let IsbnToQuery = MongoDbStubCreator.IdValueThatCausesTheDbToThrowAnError;
            let bookRepositoryGetBooksPromise;
            
            before(() => {
                bookRepositoryGetBooksPromise = bookRepositoryModule.getBooks({'isbn': IsbnToQuery});
            });
            
            after(() => {
                TestHelper.ResetMocks(bookRepSandbox);
            });
            
            it('should return a promise that is rejected', () => {
                return bookRepositoryGetBooksPromise.should.eventually.be.rejected;
            });
            
            it('should be rejected with a message containing the error from the database', () => {
               return bookRepositoryGetBooksPromise.should.eventually.be.rejectedWith(`There was an error getting the requested Exam data: ${MongoDbStubCreator.ExpectedDatabaseErrorMessage}`);
            });
        });
        
    });
    
    describe('given no search parameters', () => {
       
        describe('when searching for book details', () => {
            
            let bookRepositoryGetBooksPromise;
            
            before(() => {
                bookRepositoryGetBooksPromise = bookRepositoryModule.getBooks({});
            });
            
            after(() => {
                TestHelper.ResetMocks(bookRepSandbox);
                mongoDbStub.Find.reset();
            });
            
            it('should return a resolved promise that is fulfilled', () => {
                return bookRepositoryGetBooksPromise.should.eventually.be.reolved;
            });
            
            it('should return a list of all books', () => {
               return bookRepositoryGetBooksPromise.should.eventually.eql(MongoDbStubCreator.ListAllBooksResult); 
            });
            
           it('should query the database', () => {
               mongoDbStub.Find.should.have.been.calledOnce;
           });
           
           it('should assemble a query to search the book collection in the database', () => {
               mongoDbStub.Find.should.have.been.calledWith('book');
           });
           
           it('should assemble a query that searches the book collection using the ISBN provided as an ID', () => {
               mongoDbStub.Find.should.have.been.calledWith('book', {});
           });
        });
    });
});