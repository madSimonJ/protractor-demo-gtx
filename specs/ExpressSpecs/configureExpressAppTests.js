import chai from 'chai';
import mockery from 'mockery';
import {default as sinon, sandbox} from 'sinon';

chai.should();

let expressAppStub = {identity: 'expressAppStub', get: sandbox.stub()};
let expressStub = sandbox.stub().returns(expressAppStub);
let middlewareConfigStub = sandbox.stub();
let configureApiRoutesStub = sandbox.stub();
let configureAngular1RoutesStub = sandbox.stub();
let dbConfigStub = sandbox.stub();
let resStub = {identity: 'resStub', sendStatus: sandbox.stub()}
let reqStub = {identity: 'reqStub'}

const env = {
    identity: 'env-test',
    rootPath: 'rootPath-test',
    db: 'db-test',
    port: 'port-test',
    reseedDBOnServerRestart: 'reseedDBOnServerRestart-test'
};

describe('The Express app createExpressApp module', () => {

    describe('given a valid set of environment variables', () => {
        
        let createExpressAppModule;
        
        before(() => {
            mockery.enable();
            mockery.registerMock('express', expressStub);
            mockery.registerMock('./configureMiddleware', middlewareConfigStub);
            mockery.registerMock('./Routes/configureApiRoutes', configureApiRoutesStub);
            mockery.registerMock('./Routes/configureRoutes', configureAngular1RoutesStub);
            mockery.registerMock('../DataAccess/mongoDBConnector', dbConfigStub);
            mockery.registerAllowable('../../ExpressApp/createExpressApp');
            createExpressAppModule = require('../../ExpressApp/createExpressApp');
            createExpressAppModule.SetUp(env)
            
           let callToExpressGet = expressAppStub.get.firstCall;
           let routeCallback = callToExpressGet.args[1];
           routeCallback(reqStub, resStub);
        });
        
        after(() => {
            mockery.disable();
            sandbox.verifyAndRestore();
            sandbox.reset();
            mockery.deregisterAll();
        })
        
        describe('when calling the SetUp function', () => {
           
            it('should create a new express app', () => {
                let expressWasCalledOnce = expressStub.calledOnce;
                expressWasCalledOnce.should.be.true;
            });
            
            it('should call middlewareConfig', () => {
                let middlewareConfigWasCalledOnce = middlewareConfigStub.calledOnce;
                middlewareConfigWasCalledOnce.should.be.true;
            });
            
            it('should pass the Express app to MiddlewareConfig', () => {
                let callToMiddlwareConfig = middlewareConfigStub.firstCall;
                let firstParameterToMiddlewareConfig = callToMiddlwareConfig.args[0];
                firstParameterToMiddlewareConfig.identity.should.equal('expressAppStub');
            });
            
            it('should pass the environment variables to MiddlewareConfig', function() {
                let callToMiddlwareConfig = middlewareConfigStub.firstCall;
                let firstParameterToMiddlewareConfig = callToMiddlwareConfig.args[1];
                firstParameterToMiddlewareConfig.identity.should.equal('env-test');
            });
            
            it('should call ConfigureApiRoutes', () => {
                let callToConfigureApiRoutes = configureApiRoutesStub.firstCall;
                let firstParameterToConfigureApiRoutes = callToConfigureApiRoutes.args[0];
                firstParameterToConfigureApiRoutes.identity.should.equal('expressAppStub');
            });
            
            it('should call ConfigureAngular1Routes', () => {
                let callToConfigureAngular1Routes = configureAngular1RoutesStub.firstCall;
                let firstParameterToConfigureAngular1Routes = callToConfigureAngular1Routes.args[0];
                firstParameterToConfigureAngular1Routes.identity.should.equal('expressAppStub');
            });
            
            it('should set up a route', () => {
                let expressGetCalledOnce = expressAppStub.get.calledOnce;
                expressGetCalledOnce.should.be.true;
            });
            
            it('should set up a route that matches all paths', function() {
               let callToExpressGet = expressAppStub.get.firstCall;
               let specifiedRoutePath = callToExpressGet.args[0];
               specifiedRoutePath.should.equal('*');
            });
            
            it('should set up a route that returns a status to the browser', () => {
                let responseSendStatusWasCalledOnce = resStub.sendStatus.calledOnce;
                responseSendStatusWasCalledOnce.should.be.true;
            });
            
            it('should set up a route that returns a "file not found" status to the browser', () => {
                let callToResSendStatus = resStub.sendStatus.firstCall;
                let statusReturnedToBrowser = callToResSendStatus.args[0];
                statusReturnedToBrowser.should.equal(404);
            });
        });
    });

});

