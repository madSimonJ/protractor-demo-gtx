import chai from 'chai';
import mockery from 'mockery';
import {sandbox} from 'sinon';

import createExpressStubs from '../stubs/expressStubs';
import mockEnvs from '../stubs/mockEnvs';

chai.should();

let expressStubs = createExpressStubs(sandbox);
let morganStub = sandbox.stub().returns({'identity': 'morganStub'});

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
            mockery.disable();
            sandbox.verifyAndRestore();
            sandbox.reset();
            mockery.deregisterAll();
        });
        
        it('should configure a middleware', function() {
            let expressUseCalledOnce = expressStubs.expressAppStub.use.calledOnce;
            expressUseCalledOnce.should.be.true;
        });
        
        it('should configure morgan', () => {
           let morganCalledOnce = morganStub.calledOnce;
            morganCalledOnce.should.be.true;
        });
        
        it('should configure morgan in Dev mode', () => {
            let callToMorgan = morganStub.firstCall;
            let morganMode = callToMorgan.args[0];
            morganMode.should.equal('dev');
        });
        
        it('should set morgan as a middleware', () => {
            let callToExpressUse = expressStubs.expressAppStub.use.firstCall;
            let identityOfMiddlewarePassedToExpress = callToExpressUse.args[0];
            identityOfMiddlewarePassedToExpress.identity.should.equal('morganStub');
        });
    });
});