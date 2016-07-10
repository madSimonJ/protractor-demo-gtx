import sinon from 'sinon';
import q from 'q';

const validGetBookResult = {
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
};

const expectedValidQuery = {
    _id: validGetBookResult._id
};


const createMongoDbStub = sandbox => {
    let mongoDbStub = sandbox.stub();
    
    mongoDbStub.withArgs(
        sinon.match('book'), 
        sinon.match.has("_id", validGetBookResult._id))
    .returns(q.resolve(validGetBookResult));
    
    return {'Find': mongoDbStub
    };
};


module.exports = {
    'createMongoDbStub': createMongoDbStub,
    'validGetBookResult': validGetBookResult,
    'IsbnThatWillReturnAValidBookResult': '9781848494923',
    'expectedValidQuery': expectedValidQuery,
    'IsbnThatIsInvalid': 9781848494923
};