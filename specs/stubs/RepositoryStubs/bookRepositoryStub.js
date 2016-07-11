import sinon from 'sinon';
import q from 'q';
import _ from 'lodash';

const validGetBookResult = [{
  _id: '9781848494923',
  title: 'Flute Exam Pieces, Grade 1 (2014-2017)',
  isbn10: '1848494920',
  isbn13: '9781848494923',
  publisher: 'Associated Board of the Royal Schools of Music, United Kingdom',
  publicationDate: 2013,
  piecesInBook: [{
    number: 1,
    piece_id: 'piece1'
  }, {
    number: 2,
    piece_id: 'piece2'
  }, {
    number: 3,
    piece_id: 'piece3'
  }, {
    number: 4,
    piece_id: 'piece4'
  }, {
    number: 5,
    piece_id: 'piece5'
  }, {
    number: 6,
    piece_id: 'piece6'
  }, {
    number: 7,
    piece_id: 'piece7'
  }, {
    number: 8,
    piece_id: 'piece8'
  }, {
    number: 9,
    piece_id: 'piece9'
  }]
}, {
  _id: '9780193571815',
  title: 'Music Through Time for Flute, Book 1',
  isbn10: '0193571811',
  isbn13: '9780193571815',
  publisher: 'OUP - Oxford University Press',
  publicationDate: 1992,
  piecesInBook: [{
    number: 1,
    piece_id: 'piece10'
  }, {
    number: 2,
    piece_id: 'piece21'
  }]
}, {
  _id: '9790220906466',
  title: 'Harlequin, Book 1',
  isbn13: '9790220906466',
  publisher: 'Cramer Music',
  publicationDate: 2004,
  piecesInBook: [{
    number: 1,
    piece_id: 'piece11'
  }, {
    number: 2,
    piece_id: 'piece18'
  }]
}];


const ValidIsbnNumber = _.first(validGetBookResult)._id;

const expectedValidQuery = {
    'isbn': ValidIsbnNumber
};

const InvalidIsbnNumber = 9781848494923;


const createBookRepositoryStub = sandbox => {
  
    let getBookStub = sandbox.stub();
    
    getBookStub.withArgs(
        sinon.match.has('isbn', ValidIsbnNumber))
        .returns(q.resolve(_.first(validGetBookResult)));
    
    return {
        getBooks: getBookStub
    };
};

module.exports = {
    'createBookRepositoryStub': createBookRepositoryStub,
    'expectedValidQuery': expectedValidQuery,
    'ValidIsbnNumber': ValidIsbnNumber,
    'InvalidIsbnNumber': InvalidIsbnNumber
};