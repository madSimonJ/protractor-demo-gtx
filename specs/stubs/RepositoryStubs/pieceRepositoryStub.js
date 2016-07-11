import sinon from 'sinon';
import q from 'q';

const expectedPieceQuery = [
    'piece1',
    'piece2',
    'piece3',
    'piece4',
    'piece5',
    'piece6',
    'piece7',
    'piece8',
    'piece9',
];

const validPieceListData = [{
  _id: 'piece1',
  composer: 'Hook',
  title: 'Minuetto: 2nd movt from Sonata in Eb, Op. 99 No. 3, arr. Wastall',
}, {
  _id: 'piece2',
  composer: 'Purcell',
  title: 'Rigaudon, Z. 653, arr. Stuart'
}, {
  _id: 'piece3',
  composer: 'Trad. Irish',
  title: 'The Rakes o’ Mallow, arr. Denley'
}, {
  _id: 'piece4',
  composer: 'Keith Amos',
  title: 'Lupin, the Pot-Bellied Pig: No. 9'
}, {
  _id: 'piece5',
  composer: 'Ros Stephen',
  title: 'Guanabara Bay'
}, {
  _id: 'piece6',
  composer: 'Rogers & Hammerstein',
  title: 'Edelweiss'
}, {
  _id: 'piece7',
  composer: 'Nikki Iles',
  title: 'Jazz Waltz'
}, {
  _id: 'piece8',
  composer: 'E. Köhler',
  title: 'Exercise in G'
}, {
  _id: 'piece9',
  composer: 'Oliver Ledbury',
  title: 'Itchy Feet (arpeggio in final bar optional)'
}];

const createPieceRepositoryStub = sandbox => {
  
    let getPieceStub = sandbox.stub();
    let getPieceListStub = sandbox.stub();
    
    getPieceListStub
        .withArgs(sinon.match.array)
        .returns(q.resolve(validPieceListData));
    
    
    return {
        getPieces: getPieceStub,
        getPieceList: getPieceListStub
    };
};

module.exports = {
    'createPieceRepositoryStub': createPieceRepositoryStub,
    'expectedPieceQuery': expectedPieceQuery,
    'validPieceListData': validPieceListData
};