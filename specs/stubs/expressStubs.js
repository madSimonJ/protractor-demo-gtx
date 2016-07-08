
module.exports = sandbox => {
    let expressAppStub = {
        identity: 'expressAppStub', 
        get: sandbox.stub(), 
        listen: sandbox.stub(),
        use: sandbox.stub(),
        all: sandbox.stub()
    };
    let expressStub = sandbox.stub().returns(expressAppStub);
    
    let reqStub = {
        url: '',
        'identity': 'reqStub'
    };
    
    let resStub = {
        identity: 'resStub', 
        sendStatus: sandbox.stub(),
        sendFile: sandbox.stub()
    };
    
    return {
        'expressAppStub': expressAppStub,
        'expressStub': expressStub,
        'reqStub': reqStub,
        'resStub': resStub
    };
};