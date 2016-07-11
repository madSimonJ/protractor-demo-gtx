describe('The Book Controller', () => {

  let bookCtrlSandbox = sinon.sandbox.create();  
  let mockUserResource, $httpBackend, controllerConstructor;
  let bookCtrlModule, mockScope, mockRouteParams, mockBookFactory;
  describe('given a valid ISBN as a route parameter', () => {
    before(() => {
      mockRouteParams = {isbn : 'a valid isbn'};
      mockBookFactory = {
        get: bookCtrlSandbox.stub().returns({'validBook': true}),
        query: bookCtrlSandbox.stub().returns([{'validBook': true}])
      };
    });

    beforeEach(module('ductia'));
    beforeEach(inject(($controller, $rootScope) => {
      controllerConstructor = $controller;
      mockScope = $rootScope.$new();
      let bookCtrlInjectedDependencies = {
        '$scope': mockScope,
        'bookFactory': mockBookFactory,
        '$routeParams': mockRouteParams
      };
      bookCtrlModule = controllerConstructor('bookCtrl', bookCtrlInjectedDependencies);
    }));

    afterEach(() => {
      bookCtrlSandbox.verify();
    });

    it('should call the Book Factory "Get" command', () => {
      let bookFactoryGetStub = mockBookFactory.get;
      let getStubCallCount = bookFactoryGetStub.callCount;
      getStubCallCount.should.equal(1);
    });

    it('should pass the ISBN as a parameter', () => {
      let expectedQuery = {
        isbn: 'a valid isbn'
      };
      let firstCallToBookFactoryGet = mockBookFactory.get.firstCall;
      let getCallQueryParameter = firstCallToBookFactoryGet.args[0];
      getCallQueryParameter.should.eql(expectedQuery);
    });

    it('should set the "Book" property of the Scope to the return value of the query', () => {
      let scopeBookProperty = mockScope.Book;
      scopeBookProperty.should.eql({'validBook': true});
    });

  });

  describe('given no ISBN parameter', () => {
    beforeEach(module('ductia'));
    beforeEach(inject(($controller, $rootScope) => {
      controllerConstructor = $controller;
      mockScope = $rootScope.$new();
      let bookCtrlInjectedDependencies = {
        '$scope': mockScope,
        'bookFactory': mockBookFactory,
        '$routeParams': {}
      };
      bookCtrlModule = controllerConstructor('bookCtrl', bookCtrlInjectedDependencies);
    }));

    afterEach(() => {
      bookCtrlSandbox.verify();
    });

    it('should call the Book Factory "Query" command', () => {
      let bookFactoryQueryStub = mockBookFactory.query;
      let getStubCallCount = bookFactoryQueryStub.callCount;
      getStubCallCount.should.equal(1);
    });

    it('should set the "Books" property of the Scope to the return value of the query', () => {
      let scopeBookProperty = mockScope.Books;
      scopeBookProperty.should.eql([{'validBook': true}]);
    });
  });
});
