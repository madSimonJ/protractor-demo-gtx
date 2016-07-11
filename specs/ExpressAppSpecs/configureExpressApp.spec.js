import TestHelper from '../stubs/TestHelper';
import mockery from 'mockery';
import {sandbox} from 'sinon';

import createExpressStubs from '../stubs/expressStubs';
import mockEnvs from '../stubs/mockEnvs';

TestHelper.SetUpChai();

let configureRouteSandbox = sandbox.create();

let middlewareConfigStub = configureRouteSandbox.stub();
let configureApiRoutesStub = configureRouteSandbox.stub();
let configureAngular1RoutesStub = configureRouteSandbox.stub();
let dbConfigStub = {identity: 'dbConfigStub', connect: configureRouteSandbox.stub()};
let expressStubs = createExpressStubs(configureRouteSandbox);

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
            TestHelper.DeregisterMocks(mockery, configureRouteSandbox);
        });
        
        describe('when calling the SetUp function', () => {
           
            before(() => {
                createExpressAppModule.SetUp(env);

               let callToExpressGet = expressStubs.expressAppStub.get.firstCall;
               let routeCallback = callToExpressGet.args[1];
               routeCallback(expressStubs.reqStub, expressStubs.resStub);         
            });
            
            after(() => {
                TestHelper.ResetMocks(configureRouteSandbox);
            });
            
            it('should create a new express app', () => {
                expressStubs.expressStub.should.have.been.calledOnce;
            });
            
            it('should call middlewareConfig', () => {
                middlewareConfigStub.should.have.been.calledOnce;
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
                expressStubs.expressAppStub.get.should.have.been.calledOnce;
            });
            
            it('should set up a route that matches all paths', function() {
                expressStubs.expressAppStub.get.firstCall.should.have.been.calledWith('*');
            });
            
            it('should set up a route that returns a status to the browser', () => {
                expressStubs.resStub.sendStatus.should.have.been.calledOnce;
            });
            
            it('should set up a route that returns a "file not found" status to the browser', () => {
                expressStubs.resStub.sendStatus.firstCall.should.have.been.calledWith(404);
            });
        });
        
        describe('when calling the Start function', () => {
           
            before(() => {
                createExpressAppModule.Start(expressStubs.expressAppStub);
            });
            
            after(() => {
                TestHelper.DeregisterMocks(mockery, configureRouteSandbox);
            });
            
            it('should connect to the database', () => {
                dbConfigStub.connect.should.have.been.calledOnce;
            });
            
            it('should pass environment variables to the database config module', () => {
                let callToDbConfigModule = dbConfigStub.connect.firstCall;
                let environmentVariableParameter = callToDbConfigModule.args[0];
                environmentVariableParameter.identity.should.equal(env.identity);
            });
            
            it('should start the app listening for incoming requests', () => {
                expressStubs.expressAppStub.listen.should.have.been.calledOnce;
            });
            
            it('should listen on port 8080', function() {
                expressStubs.expressAppStub.listen.firstCall.should.have.been.calledWith(8080);
            });
        });
    });
});

