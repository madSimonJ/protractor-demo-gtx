

const createRouteResponsesStub = sandbox => {
  
    return {
        SendDocumentIfFound: sandbox.stub(),
        SendFileNotFoundResponse: sandbox.stub(),
        redirectToIndex: sandbox.stub()
    };
};

module.exports = createRouteResponsesStub;