const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

global.sinon = sinon;
chai.use(sinonChai);
