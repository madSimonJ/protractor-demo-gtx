const chai = require('chai');
const expect = chai.expect;
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);

describe('the book index page', () => {

    describe('when loading the page', () => {
       
      let bookListRepeater;
      let bookListCount;
      let bookElements;
      let bookListFirstElement;
      let bookListFirstTitle, bookListFirstIsbn13, bookListFirstPublisher, bookListFirstPublicationDate;

      before(() => {
        browser.get('http://localhost:8080/angular1/books');

        bookListRepeater = element.all(by.repeater('book in Books'));
        bookListRepeater.then(data => {
          bookElements = data;
          bookListFirstElement = bookElements[0];
          bookListCount = data.length;

          bookElements[0].element(by.binding('title')).getText().then(function(text) {
            bookListFirstTitle = text;
          });

          bookElements[0].element(by.binding('isbn13')).getText().then(function(text) {
            bookListFirstIsbn13 = text;
          });

          bookElements[0].element(by.binding('publisher')).getText().then(function(text) {
            bookListFirstPublisher = text;
          });

          bookElements[0].element(by.binding('publicationDate')).getText().then(function(text) {
            bookListFirstPublicationDate = text;
          });
        });
      });

      it('should display details of all books', () => {
        expect(bookListCount).to.equal(28);
      });

      it('should display the book title', () => {
        expect(bookListFirstTitle).to.equal('Flute Exam Pieces, Grade 1 (2014-2017)');
      });

      it('should display the book\'s isbn', () => {
        expect(bookListFirstIsbn13).to.equal('9781848494923');
      });

      it('should display the book\'s publisher', () => {
        expect(bookListFirstPublisher).to.equal('Associated Board of the Royal Schools of Music, United Kingdom');
      });

      it('should display the book\'s publication date', () => {
        expect(bookListFirstPublicationDate).to.equal('2013');
      });
    });
    
    describe('when clicking a link to a detail page', () => {
       
        before(() => {
            browser.get('http://localhost:8080/angular1/books');
            let bookListRepeater = element.all(by.repeater('book in Books'));
            let firstElementInBookList = bookListRepeater.first();
            let linkInFirstElement = firstElementInBookList.$('.bookDetailLink');
            linkInFirstElement.click();
        });
        
        it('should load the detail page for the selected book', () => {
           expect(browser.getLocationAbsUrl()).to.eventually.equal('/angular1/books/9781848494923');
        });
    });
});

describe('the book detail page', () => {

  let bookTitleElement;
  let bookIsbn13Element;
  let bookPublisherElement;
  let bookPublicationDateElement;

  before(() => {
    browser.get('http://localhost:8080/angular1/books/9790220906466');

    bookTitleElement = element(by.binding('Book.title'));
    bookIsbn13Element = element(by.binding('Book.isbn13'));
    bookPublisherElement = element(by.binding('Book.publisher'));
    bookPublicationDateElement = element(by.binding('Book.publicationDate'));
  });

  it('should display the title of the selected book', () => {
    expect(bookTitleElement.getText()).to.eventually.equal('Harlequin, Book 1');
  });

  it('should display the isbn of the selected book', () => {
    expect(bookIsbn13Element.getText()).to.eventually.equal('9790220906466');
  });

  it('should display the publisher of the selected book', () => {
    expect(bookPublisherElement.getText()).to.eventually.equal('Cramer Music');
  });

  it('should display the publication date of the selected book', () => {
    expect(bookPublicationDateElement.getText()).to.eventually.equal('2004');
  });

});
