describe('the exam controller', () => {

    let sandbox = sinon.sandbox.create();
    chai.should();
    
  let mockRouteParams, mockExamFactory, controllerConstructor, mockScope, examCtrlModule;

  describe('given a set of valid url parameters', () => {

    before(() => {
      mockRouteParams = {
        instrument: 'flute',
        grade: 1,
        board: 'abrsm'
      };
      mockExamFactory = {
        query: sandbox.stub()
      };
    });

    beforeEach(module('ductia'));
    beforeEach(inject(($controller, $rootScope) => {
      controllerConstructor = $controller;
      mockScope = $rootScope.$new();
      let examCtrlInjectedDependencies = {
        '$scope': mockScope,
        'examFactory': mockExamFactory,
        '$routeParams': mockRouteParams
      };
      examCtrlModule = controllerConstructor('examCtrl', examCtrlInjectedDependencies);
    }));

    afterEach(() => {
      sandbox.verifyAndRestore();
      mockExamFactory.query.reset();
    });

    it('should add the selected instrument to the scope', () => {
      mockScope.SelectedInstrument.should.equal('flute');
    });

    it('should add the selected grade to the scope', () => {
      mockScope.SelectedGrade.should.equal(1);
    });

    it('should add the selected exam board to the scope', () => {
      mockScope.SelectedBoard.should.equal('abrsm');
    });

    it('should query the examFactory', () => {
      mockExamFactory.query.callCount.should.equal(1);
    });

    it('should use the selected instrument as a query parameter', () => {
      let callToExamFactory = mockExamFactory.query.firstCall;
      let examFactoryQuery = callToExamFactory.args[0];
      examFactoryQuery.instrument.should.equal('flute');
    });

    it('should use the selected grade as a query parameter', () => {
      let callToExamFactory = mockExamFactory.query.firstCall;
      let examFactoryQuery = callToExamFactory.args[0];
      examFactoryQuery.grade.should.equal(1);
    });

    it('should use the selected exam board as a query parameter', () => {
      let callToExamFactory = mockExamFactory.query.firstCall;
      let examFactoryQuery = callToExamFactory.args[0];
      examFactoryQuery.board.should.equal('abrsm');
    });


  });

  describe('given a set of valid url parameters with no grade specified', () => {
    before(() => {
      mockRouteParams = {
        instrument: 'flute',
        board: 'abrsm'
      };
      mockExamFactory = {
        query: sandbox.stub()
      };
    });

    beforeEach(module('ductia'));
    beforeEach(inject(($controller, $rootScope) => {
      controllerConstructor = $controller;
      mockScope = $rootScope.$new();
      let examCtrlInjectedDependencies = {
        '$scope': mockScope,
        'examFactory': mockExamFactory,
        '$routeParams': mockRouteParams
      };
      examCtrlModule = controllerConstructor('examCtrl', examCtrlInjectedDependencies);
    }));

    it('should not set a value for grade on the scope', () => {
      should.equal(mockScope.SelectedGrade, undefined);
    });

    it('should not set a value for grade', () => {
      let callToExamFactory = mockExamFactory.query.firstCall;
      let examFactoryQuery = callToExamFactory.args[0];
      examFactoryQuery.should.not.include.keys('grade');
    });

  });

  describe('given a set of valid url parameters with no grade or instrument specified', () => {
    before(() => {
      mockRouteParams = {
        board: 'abrsm'
      };
      mockExamFactory = {
        query: sandbox.stub()
      };
    });

    beforeEach(module('ductia'));
    beforeEach(inject(($controller, $rootScope) => {
      controllerConstructor = $controller;
      mockScope = $rootScope.$new();
      let examCtrlInjectedDependencies = {
        '$scope': mockScope,
        'examFactory': mockExamFactory,
        '$routeParams': mockRouteParams
      };
      examCtrlModule = controllerConstructor('examCtrl', examCtrlInjectedDependencies);
    }));

    it('should not set a value for instrument on the scope', () => {
      should.equal(mockScope.SelectedInstrument, undefined);
    });

    it('should not set a value for instrument', () => {
      let callToExamFactory = mockExamFactory.query.firstCall;
      let examFactoryQuery = callToExamFactory.args[0];
      examFactoryQuery.should.not.include.keys('instrument');
    });

  });

  describe('given a no URL parameters', () => {
    before(() => {
      mockRouteParams = {
      };
      mockExamFactory = {
        query: sandbox.stub()
      };
    });

    beforeEach(module('ductia'));
    beforeEach(inject(($controller, $rootScope) => {
      controllerConstructor = $controller;
      mockScope = $rootScope.$new();
      let examCtrlInjectedDependencies = {
        '$scope': mockScope,
        'examFactory': mockExamFactory,
        '$routeParams': mockRouteParams
      };
      examCtrlModule = controllerConstructor('examCtrl', examCtrlInjectedDependencies);
    }));

    it('should not set a value for exam board on the scope', () => {
      should.equal(mockScope.SelectedBoard, undefined);
    });

    it('should not set a value for exam board', () => {
      let callToExamFactory = mockExamFactory.query.firstCall;
      let examFactoryQuery = callToExamFactory.args[0];
      examFactoryQuery.should.not.include.keys('board');
    });

  });
});
