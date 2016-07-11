describe('The Piece Controller', () => {

    let sandbox = sinon.sandbox.create();
    chai.should();
    
    let mockUserResource, $httpBackend, controllerConstructor;
    let pieceCtrlModule, mockScope, mockRouteParams, mockPieceFactory;
  describe('given a valid pieceid as a route parameter', () => {
    before(() => {
      mockRouteParams = {pieceId : 'piece33'};
      mockPieceFactory = {
        get: sandbox.stub().returns({'validPiece': true}),
        query: sandbox.stub().returns([{'validPiece': true}])
      };
    });

    beforeEach(module('ductia'));
    beforeEach(inject(($controller, $rootScope) => {
      controllerConstructor = $controller;
      mockScope = $rootScope.$new();
      let pieceCtrlInjectedDependencies = {
        '$scope': mockScope,
        'pieceFactory': mockPieceFactory,
        '$routeParams': mockRouteParams
      };
      pieceCtrlModule = controllerConstructor('pieceCtrl', pieceCtrlInjectedDependencies);
    }));

    afterEach(() => {
      sandbox.verifyAndRestore();
    });

    it('should call the Piece Factory "Get" command', () => {
      let pieceFactoryGetStub = mockPieceFactory.get;
      let getStubCallCount = pieceFactoryGetStub.callCount;
      getStubCallCount.should.equal(1);
    });

    it('should pass the pieceId as a parameter', () => {
      let expectedQuery = {
        pieceId: 'piece33'
      };
      let firstCallToPieceFactoryGet = mockPieceFactory.get.firstCall;
      let getCallQueryParameter = firstCallToPieceFactoryGet.args[0];
      getCallQueryParameter.should.eql(expectedQuery);
    });

    it('should set the "Piece" property of the Scope to the return value of the query', () => {
      let scopePieceProperty = mockScope.Piece;
      scopePieceProperty.should.eql({'validPiece': true});
    });

  });

  describe('given no pieceId parameter', () => {
    beforeEach(module('ductia'));
    beforeEach(inject(($controller, $rootScope) => {
      controllerConstructor = $controller;
      mockScope = $rootScope.$new();
      let pieceCtrlInjectedDependencies = {
        '$scope': mockScope,
        'pieceFactory': mockPieceFactory,
        '$routeParams': {}
      };
      pieceCtrlModule = controllerConstructor('pieceCtrl', pieceCtrlInjectedDependencies);
    }));

    afterEach(() => {
      sandbox.verifyAndRestore();
    });

    it('should call the Piece Factory "Query" command', () => {
      let pieceFactoryQueryStub = mockPieceFactory.query;
      let getStubCallCount = pieceFactoryQueryStub.callCount;
      getStubCallCount.should.equal(1);
    });

    it('should set the "Pieces" property of the Scope to the return value of the query', () => {
      let scopePieceProperty = mockScope.Pieces;
      scopePieceProperty.should.eql([{'validPiece': true}]);
    });

  });

});
