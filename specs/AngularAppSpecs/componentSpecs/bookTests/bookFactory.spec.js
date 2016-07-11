let sandbox = sinon.sandbox.create();
chai.should();

describe('the bookFactory', () => {

  let bookFactory, mockResource;

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
    sandbox.verify();
  });

  it('should return a URL resource handler', inject(bookFactory => {
    bookFactory.resourceIsValid.should.be.true;
  }));

  it('should call the appropriate API with ISBN as an optional route parameter', inject(bookFactory => {
    let callToResource = mockResource.firstCall;
    let resourceApiUrl = callToResource.args[0];
    resourceApiUrl.should.equal('/api/books/:isbn');
  }));

  it('should pass the ISBN to the API when specified', inject(bookFactory => {
    let callToResource = mockResource.firstCall;
    let resourceApiParameter = callToResource.args[1];
    resourceApiParameter.should.eql({isbn: '@isbn'});
  }));

});
