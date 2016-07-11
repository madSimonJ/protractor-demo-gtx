import TestHelper from '../../stubs/TestHelper';
import mockery from 'mockery';
import {sandbox} from 'sinon';
import path from 'path';

import createExpressStubs from '../../stubs/expressStubs';
let configureRouteSandbox = sandbox.create();

TestHelper.SetUpChai();

let expressStubs = createExpressStubs(configureRouteSandbox);

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
            TestHelper.DeregisterMocks(mockery, configureRouteSandbox);
        });
        
        describe('when configuring routes', () => {
            
            const angular1TxtRoute = '/Angular1/*.txt';
            const angular1CssRoute = '/Angular1/css/*.css';
            const angular1AppMinJsRoute = '/Angular1/js/app.min.js';
            const angular1DefaultRoute = '/Angular1*';
            
            it('should configure a set of Get routes', () => {
                expressStubs.expressAppStub.get.should.have.callCount(4);
            });
            
            it('should configure a route for text files in the Angular1 app', () => {
                expressStubs.expressAppStub.get.firstCall.should.have.been.calledWith(angular1TxtRoute);
            });
            
            it('should configure a route for CSS files in the Angular1 app', () => {
                expressStubs.expressAppStub.get.secondCall.should.have.been.calledWith(angular1CssRoute);
            });
            
            it('should configure a route for the app.js file in the Angular1 app', () => {
                expressStubs.expressAppStub.get.thirdCall.should.have.been.calledWith(angular1AppMinJsRoute);
            });
            
            it('should configure a route for all other paths in the Angular1 app', () => {
                expressStubs.expressAppStub.get.getCall(3).should.have.been.calledWith(angular1DefaultRoute);
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