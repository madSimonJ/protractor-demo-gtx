import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import sinonChai from 'sinon-chai';
import _ from 'lodash';

const DeregisterMocks = (mockery, collection) => {
    ResetMocks(collection);
    mockery.disable();
    mockery.deregisterAll();
};

const ResetMocks = sandbox => {
    sandbox.verify();
    sandbox.reset();
};

const SetUpChai = () => {
    chai.should();
    chai.use(chaiAsPromised);
    chai.use(sinonChai);
};

module.exports = {
    'DeregisterMocks': DeregisterMocks,
    'SetUpChai': SetUpChai,
    'ResetMocks': ResetMocks
};