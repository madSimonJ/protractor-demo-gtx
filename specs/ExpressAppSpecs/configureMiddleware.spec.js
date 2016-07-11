import TestHelper from '../stubs/TestHelper';
import mockery from 'mockery';
import {sandbox} from 'sinon';

import createExpressStubs from '../stubs/expressStubs';
import mockEnvs from '../stubs/mockEnvs';

TestHelper.SetUpChai();

let configureMiddlewareSandbox = sandbox.create();
let expressStubs = createExpressStubs(configureMiddlewareSandbox);
let morganStub = configureMiddlewareSandbox.stub().returns({'identity': 'morganStub'});

describe('The Express app createExpressApp module', () => {

    describe('given a valid set of environment variables', () => {
        
        let configureMiddlewareModule;
        
        before(() => {
            mockery.enable({
                warnOnReplace: false,
                warnOnUnregistered: false
            });
            mockery.registerMock('morgan', morganStub);
            mockery.registerAllowable('../../ExpressApp/configureMiddleware');
            configureMiddlewareModule = require('../../ExpressApp/configureMiddleware');
            configureMiddlewareModule(expressStubs.expressAppStub, mockEnvs.mockEnv);
        });
        
        after(() => {
            TestHelper.DeregisterMocks(mockery, configureMiddlewareSandbox);
        });
        
        it('should configure a middleware', function() {
            expressStubs.expressAppStub.use.should.have.been.calledOnce;
        });
        
        it('should configure morgan', () => {
           morganStub.should.have.been.calledOnce;
        });
        
        it('should configure morgan in Dev mode', () => {
            morganStub.should.have.been.calledWith('dev');
        });
        
        it('should set morgan as a middleware', () => {
            let callToExpressUse = expressStubs.expressAppStub.use.firstCall;
            let identityOfMiddlewarePassedToExpress = callToExpressUse.args[0];
            identityOfMiddlewarePassedToExpress.identity.should.equal('morganStub');
        });
    });
});