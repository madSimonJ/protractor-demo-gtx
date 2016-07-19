exports.config = {
  seleniumAddress: 'http://localhost:4444/wd/hub',
  specs: ['specs/IntegrationTests/**/*.js'],
  capabilities: {
    browserName: 'chrome'
  }, 
  framework: 'mocha',
  mochaOpts: {
   timeout: 5000
  }
};
