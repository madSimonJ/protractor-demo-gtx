import chai from 'chai';
import mockery from 'mockery';
import {sandbox} from 'sinon';
import path from 'path';

import createExpressStubs from '../../stubs/expressStubs';

chai.should();

let expressStubs = createExpressStubs(sandbox);

describe('The Express app configureRoutes module', () => {
   
    describe('given an instance of Express', () => {
       
        let configureRoutesModule;
    
        const angular1SinglePage = path.join(__dirname, '../../../', 'Build', 'Angular1', 'index.html');
        const buildDirectory = path.join(__dirname, '../../../', 'Build');
        const commonDirectory = path.join(buildDirectory, 'Common');

        
        before(() => {
            mockery.enable({
                warnOnReplace: false,
                warnOnUnregistered: false
            });

            mockery.registerAllowable('path');
            mockery.registerAllowable('../../../ExpressApp/Routes/configureRoutes');
            configureRoutesModule = require('../../../ExpressApp/Routes/configureRoutes');
            configureRoutesModule(expressStubs.expressAppStub);
        });
        
        after(() => {
            mockery.disable();
            sandbox.verifyAndRestore();
            sandbox.reset();
            mockery.deregisterAll();
        });
        
        describe('when configuring routes', () => {
            
            it('should configure a set of Get routes', () => {
                let appGetCallCount = expressStubs.expressAppStub.get.callCount;
                appGetCallCount.should.equal(4);
            });
            
            it('should configure a route for text files in the Angular1 app', () => {
                let firstCallToAppGet =  expressStubs.expressAppStub.get.firstCall;
                let firstRouteConfigured = firstCallToAppGet.args[0];
                firstRouteConfigured.should.equal('/Angular1/*.txt');
            });
            
            it('should configure a route for CSS files in the Angular1 app', () => {
                let secondCallToAppGet =  expressStubs.expressAppStub.get.secondCall;
                let firstRouteConfigured = secondCallToAppGet.args[0];
                firstRouteConfigured.should.equal('/Angular1/css/*.css');
            });
            
            it('should configure a route for the app.js file in the Angular1 app', () => {
                let thirdCallToAppGet =  expressStubs.expressAppStub.get.thirdCall;
                let thirdRouteConfigured = thirdCallToAppGet.args[0];
                thirdRouteConfigured.should.equal('/Angular1/js/app.min.js');
            });
            
            it('should configure a route for all other paths in the Angular1 app', () => {
                let fourthCallToAppGet =  expressStubs.expressAppStub.get.getCall(3);
                let fourthRouteConfigured = fourthCallToAppGet.args[0];
                fourthRouteConfigured.should.equal('/Angular1*');
            });
            
            
            
        });
        
        describe('when the browser requests a text file in the Angular1 app', () => {
            
            before(() => {
                let firstCallToAppGet =  expressStubs.expressAppStub.get.firstCall;
                let textFileRouteCallback = firstCallToAppGet.args[1];
                let reqStub = expressStubs.reqStub;
                reqStub.url = 'testfile.txt';
                
                textFileRouteCallback(expressStubs.reqStub, expressStubs.resStub);
            });
            
            it('should send a file in response to the request', () => { 
                let resSendFileCalledOnce = expressStubs.resStub.sendFile.calledOnce;
                resSendFileCalledOnce.should.be.true;
            });
            
            it('should send a file from the common content directory', () => {
                
            });
            
        });
        
    });
});