describe('the examFactory', () => {

    let sandbox = sinon.sandbox.create();
    chai.should();
    
  let examFactory, mockResource;

  beforeEach(module('ductia'));
  beforeEach(() => {
    mockResource = sandbox.stub().returns({
      resourceIsValid: true
    });

    module($provide => {
      $provide.value('$resource', mockResource);
    });

  });

  afterEach(() => {
    sandbox.verifyAndRestore();
  });

  it('should return a URL resource handler', inject(examFactory => {
    examFactory.resourceIsValid.should.be.true;
  }));

  it('should call the appropriate API with board, instrument & grades as optional route parameters', inject(examFactory => {
    let callToResource = mockResource.firstCall;
    let resourceApiUrl = callToResource.args[0];
    resourceApiUrl.should.equal('/api/exams/:board/:instrument/:grade');
  }));

  it('should pass the ISBN to the API when specified', inject(examFactory => {
    let callToResource = mockResource.firstCall;
    let resourceApiParameter = callToResource.args[1];
    resourceApiParameter.should.eql({board: '@board', instrument: '@instrument', grade: '@grade'});
  }));
});
