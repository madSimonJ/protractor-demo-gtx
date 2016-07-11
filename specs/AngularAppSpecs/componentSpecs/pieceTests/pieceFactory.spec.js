describe('the pieceFactory', () => {

    let sandbox = sinon.sandbox.create();
    chai.should();
    
  let pieceFactory, mockResource;

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

  it('should return a URL resource handler', inject(pieceFactory => {
    pieceFactory.resourceIsValid.should.be.true;
  }));

  it('should call the appropriate API with pieceId as an optional route parameter', inject(pieceFactory => {
    let callToResource = mockResource.firstCall;
    let resourceApiUrl = callToResource.args[0];
    resourceApiUrl.should.equal('/api/pieces/:pieceId');
  }));

  it('should pass the ISBN to the API when specified', inject(function(pieceFactory) {
    var callToResource = mockResource.firstCall;
    var resourceApiParameter = callToResource.args[1];
    resourceApiParameter.should.eql({pieceId: '@pieceId'});
  }));

});
