describe('the Main control', () => {

  let mainCtrlModule, controllerConstructor, mockScope;
  let expectedHeaderText = 'Ductia';
  let expectedWelcomeText = 'A website for searching for exam pieces and the ideal books to get them with';

  beforeEach(module('ductia'));
  beforeEach(inject(($controller, $rootScope) => {
    controllerConstructor = $controller;
    mockScope = $rootScope.$new();
    let instrumentCtrlInjectedDependencies = {
      '$scope': mockScope,
    };
    mainCtrlModule = controllerConstructor('mainCtrl', instrumentCtrlInjectedDependencies);
  }));

  afterEach(() => {
  });

  it('should show the expected header text', () => {
      mockScope.header.should.equal(expectedHeaderText);
  });

  it('should show the expected welcome text', () => {
    mockScope.welcomeText.should.equal(expectedWelcomeText);
  });
});
