var chai = require('chai');
var expect = chai.expect;
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);

describe('the home section', () => {

  var headerElement, headerText;
  var welcomeTextElement, welcomeText;

  before(() => {
    browser.get('http://localhost:8080/angular1');
    headerElement = element(by.binding('header'));
    welcomeTextElement = element(by.binding('welcomeText'));
  });

  it('should set the correct header', () => {
    expect(headerElement.getText()).to.eventually.equal('Ductia');
  });

  it('should set the correct welcome message', () => {
    expect(welcomeTextElement.getText()).to.eventually.equal('A website for searching for exam pieces and the ideal books to get them with');
  });
});
