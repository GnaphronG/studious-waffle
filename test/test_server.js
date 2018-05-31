const cluster = require('cluster');
const app = require('../src/app');
const { server: config } = require('config');

describe('server', () => {
  const sandbox = sinon.createSandbox();

  beforeEach(function() {
    sandbox.stub(config, 'port').value(0);
    sandbox.stub(config, 'cluster').value(1);
    if (typeof cluster.fork === 'function') {
      sandbox.stub(cluster, 'fork');
    }
  });

  afterEach(function() {
    sandbox.restore();
  });

  it('Should load the server on config.port', () => {
    const l = sandbox.stub(app, 'listen');
    sandbox.stub(cluster, 'isMaster').value(false);

    require('../src/server');
    expect(l).to.have.been.calledOnce.calledWith(0);
  });
});
