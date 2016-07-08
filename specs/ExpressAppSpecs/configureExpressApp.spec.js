import chai from 'chai';
import mockery from 'mockery';
import {sandbox} from 'sinon';

import createExpressStubs from '../stubs/expressStubs';
import mockEnvs from '../stubs/mockEnvs';

chai.should();

let middlewareConfigStub = sandbox.stub();
let configureApiRoutesStub = sandbox.stub();
let configureAngular1RoutesStub = sandbox.stub();
let dbConfigStub = {identity: 'dbConfigStub', connect: sandbox.stub()};
//let resStub = {identity: 'resStub', sendStatus: sandbox.stub()};
//let reqStub = {identity: 'reqStub'};
let expressStubs = createExpressStubs(sandbox);

const env = mockEnvs.mockEnv;

describe('The Express app createExpressApp module', () => {

    describe('given a valid set of environment variables', () => {
        
        let createExpressAppModule;
        
        before(() => {
            mockery.enable({
                warnOnReplace: false,
                warnOnUnregistered: false
            });
            mockery.registerMock('express', expressStubs.expressStub);
            mockery.registerMock('./configureMiddleware', middlewareConfigStub);
            mockery.registerMock('./Routes/configureApiRoutes', configureApiRoutesStub);
            mockery.registerMock('./Routes/configureRoutes', configureAngular1RoutesStub);
            mockery.registerMock('../DataAccess/mongoDBConnector', dbConfigStub);
            mockery.registerAllowable('../../ExpressApp/createExpressApp');
            createExpressAppModule = require('../../ExpressApp/createExpressApp');
        });
        
        after(() => {
            mockery.disable();
            sandbox.verifyAndRestore();
            sandbox.reset();
            mockery.deregisterAll();
        });
        
        describe('when calling the SetUp function', () => {
           
            before(() => {
                createExpressAppModule.SetUp(env);

               let callToExpressGet = expressStubs.expressAppStub.get.firstCall;
               let routeCallback = callToExpressGet.args[1];
               routeCallback(expressStubs.reqStub, expressStubs.resStub);         
            });
            
            after(() => {
                sandbox.verifyAndRestore();
                sandbox.reset();
            });
            
            it('should create a new express app', () => {
                let expressWasCalledOnce = expressStubs.expressStub.calledOnce;
                expressWasCalledOnce.should.be.true;
            });
            
            it('should call middlewareConfig', () => {
                let middlewareConfigWasCalledOnce = middlewareConfigStub.calledOnce;
                middlewareConfigWasCalledOnce.should.be.true;
            });
            
            it('should pass the Express app to MiddlewareConfig', () => {
                let callToMiddlwareConfig = middlewareConfigStub.firstCall;
                let firstParameterToMiddlewareConfig = callToMiddlwareConfig.args[0];
                firstParameterToMiddlewareConfig.identity.should.equal(expressStubs.expressAppStub.identity);
            });
            
            it('should pass the environment variables to MiddlewareConfig', function() {
                let callToMiddlwareConfig = middlewareConfigStub.firstCall;
                let firstParameterToMiddlewareConfig = callToMiddlwareConfig.args[1];
                firstParameterToMiddlewareConfig.identity.should.equal(env.identity);
            });
            
            it('should call ConfigureApiRoutes', () => {
                let callToConfigureApiRoutes = configureApiRoutesStub.firstCall;
                let firstParameterToConfigureApiRoutes = callToConfigureApiRoutes.args[0];
                firstParameterToConfigureApiRoutes.identity.should.equal(expressStubs.expressAppStub.identity);
            });
            
            it('should call ConfigureAngular1Routes', () => {
                let callToConfigureAngular1Routes = configureAngular1RoutesStub.firstCall;
                let firstParameterToConfigureAngular1Routes = callToConfigureAngular1Routes.args[0];
                firstParameterToConfigureAngular1Routes.identity.should.equal(expressStubs.expressAppStub.identity);
            });
            
            it('should set up a route', () => {
                let expressGetCalledOnce = expressStubs.expressAppStub.get.calledOnce;
                expressGetCalledOnce.should.be.true;
            });
            
            it('should set up a route that matches all paths', function() {
               let callToExpressGet = expressStubs.expressAppStub.get.firstCall;
               let specifiedRoutePath = callToExpressGet.args[0];
               specifiedRoutePath.should.equal('*');
            });
            
            it('should set up a route that returns a status to the browser', () => {
                let responseSendStatusWasCalledOnce = expressStubs.resStub.sendStatus.calledOnce;
                responseSendStatusWasCalledOnce.should.be.true;
            });
            
            it('should set up a route that returns a "file not found" status to the browser', () => {
                let callToResSendStatus = expressStubs.resStub.sendStatus.firstCall;
                let statusReturnedToBrowser = callToResSendStatus.args[0];
                statusReturnedToBrowser.should.equal(404);
            });
        });
        
        describe('when calling the Start function', () => {
           
            before(() => {
                createExpressAppModule.Start(expressStubs.expressAppStub);
            });
            
            after(() => {
                mockery.disable();
                sandbox.verifyAndRestore();
                sandbox.reset();
                mockery.deregisterAll();
            });
            
            it('should connect to the database', () => {
                let dbConfigConnectCalledOnce = dbConfigStub.connect.calledOnce;
                dbConfigConnectCalledOnce.should.be.true;
            });
            
            it('should pass environment variables to the database config module', () => {
                let callToDbConfigModule = dbConfigStub.connect.firstCall;
                let environmentVariableParameter = callToDbConfigModule.args[0];
                environmentVariableParameter.identity.should.equal(env.identity);
            });
            
            it('should start the app listening for incoming requests', () => {
                let expressAppListenCalledOnce = expressStubs.expressAppStub.listen.calledOnce;
                expressAppListenCalledOnce.should.be.true;
            });
            
            it('should listen on port 8080', function() {
                let callToAppStubListen = expressStubs.expressAppStub.listen.firstCall;
                let portAppIsListeningOn = callToAppStubListen.args[0];
                portAppIsListeningOn.should.equal(8080);
            });
        });
    });
});

