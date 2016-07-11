describe('the instrument control', () => {

  const expectedInstrumentList = [
    'Baritone and Euphonium',
    'Bassoon',
    'Bass Trombone',
    'Cello',
    'Clarinet',
    'Double Bass',
    'Descant Recorder',
    'Flute',
    'Guitar',
    'Harp',
    'Harpsichord',
    'Horn',
    'Horn (E Flat)',
    'Keyboard',
    'Music Theory',
    'Oboe',
    'Organ',
    'Percussion',
    'Piano',
    'Saxophone',
    'Singing',
    'Treble Recorder',
    'Trombone',
    'Trumpet',
    'Tuba',
    'Viola',
    'Violin'
  ];

  let instrumentCtrlModule, controllerConstructor, mockScope;

  beforeEach(module('ductia'));
  beforeEach(inject(($controller, $rootScope) => {
    controllerConstructor = $controller;
    mockScope = $rootScope.$new();
    let instrumentCtrlInjectedDependencies = {
      '$scope': mockScope,
    };
    instrumentCtrlModule = controllerConstructor('instrumentCtrl', instrumentCtrlInjectedDependencies);
  }));

  it('should insert the expected instrument list to the scope', () => {
    mockScope.Instruments.should.eql(expectedInstrumentList);
  });

});
