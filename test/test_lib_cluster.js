const http = require('http');
const cluster = require('cluster');
const { stopSignals } = require('../src/lib/cluster/constants');
const libCluster = require('../src/lib/cluster');

describe('lib/cluster', () => {
  it('Should load an Object', () => {
    expect(libCluster).to.be.an('Object');
  });

  it('Should contains expected fields', () => {
    expect(libCluster).to.include.all.keys(['Master', 'Worker']);
  });

  describe('lib/cluster/worker', () => {
    const sandbox = sinon.createSandbox();
    const app = http.createServer((req, res) => {
      res.end();
    });

    beforeEach(function() {
      // stub out the `hello` method
      sandbox
        .stub(app, 'listen')
        .yields(null)
        .returns(app);
      sandbox.stub(app, 'close').yields(null);
    });

    afterEach(function() {
      // completely restore all fakes created through the sandbox
      sandbox.restore();
    });

    it('Should instanciate a Worker', () => {
      const o = sandbox.stub(process, 'on');
      const w = new libCluster.Worker(app, 0);

      expect(w).to.be.an.instanceof(libCluster.Worker);
      expect(app.listen).to.have.been.calledOnce.and.been.calledWith(0);
      expect(o).to.have.callCount(1 + stopSignals.length);
      expect(o).to.have.been.calledWith('message');
    });

    it('Should shutdown the process when listening fails', () => {
      const p = sandbox.stub(process, 'exit');

      app.listen.yields(new Error('Test'));
      new libCluster.Worker(app, 0);

      expect(p).to.have.been.calledOnce.and.been.calledWith(1);
    });

    it('Should shutdown worker on "stop"', () => {
      const w = new libCluster.Worker(app, 0);
      const s = sandbox.stub(w, 'shutdown');

      w.message('stop');
      expect(s).to.have.been.calledOnce;
    });

    it('Should accept any messages', () => {
      const w = new libCluster.Worker(app, 0);
      const s = sandbox.stub(w, 'shutdown');

      w.message('listening');
      expect(s).to.not.have.been.calledOnce;
    });

    it('Should close a worker on shutdown', () => {
      const w = new libCluster.Worker(app, 0);
      const p = sandbox.stub(process, 'exit');

      w.shutdown();

      expect(app.close).to.have.been.calledOnce;
      expect(p).to.have.been.calledOnce.and.been.calledWith(0);
    });

    it('Should exit 1 if a worker shutdown fails', () => {
      const w = new libCluster.Worker(app, 0);
      const p = sandbox.stub(process, 'exit');

      app.close.yields(new Error('Test'));
      w.shutdown();

      expect(app.close).to.have.been.calledOnce;
      expect(p).to.have.been.calledOnce.and.been.calledWith(1);
    });
  });

  describe('lib/cluster/master', () => {
    const sandbox = sinon.createSandbox();
    beforeEach(function() {
      sandbox.stub(cluster, 'fork');
      sandbox.stub(cluster, 'on');
    });

    afterEach(function() {
      // completely restore all fakes created through the sandbox
      sandbox.restore();
    });

    it('Should instanciate a Master', () => {
      const w = new libCluster.Master(2);

      expect(w).to.be.an.instanceof(libCluster.Master);
      expect(cluster.fork).to.have.been.callCount(2);
      expect(cluster.on).to.have.been.calledTwice;
      expect(cluster.on)
        .to.have.been.calledWith('listening')
        .and.calledWith('exit');
    });

    it('Should return the number of worker', () => {
      const w = new libCluster.Master(2);

      sandbox.stub(cluster, 'workers').value({ 1: {}, 2: {} });

      expect(w.workers).to.be.eql(2);
    });

    it('Should teardown the cluster', () => {
      const w = new libCluster.Master(2);

      sandbox.stub(cluster, 'disconnect');
      w.teardown();

      expect(cluster.disconnect).to.have.been.calledOnce;
      expect(cluster.on).to.have.been.calledWith('exit');
    });

    it('Should handle listening message', () => {
      const w = new libCluster.Master(2);
      const a = { address: '127.0.0.1', port: 0 };

      w.listening(null, a);
      expect(a.address).to.eql('127.0.0.1');
      expect(a.port).to.eql(0);
    });

    it('Should handle listening message on any iface', () => {
      const w = new libCluster.Master(2);
      const a = { address: null, port: 0 };

      w.listening(null, a);
      expect(a.address).to.eql('0.0.0.0');
      expect(a.port).to.eql(0);
    });

    it('Should restart a worker that has died', () => {
      const w = new libCluster.Master(2);

      w.restart(null, 0, null);
      expect(cluster.fork).to.have.been.calledThrice;
    });

    it('Should restart a worker that has been signaled', () => {
      const w = new libCluster.Master(2);

      w.restart(null, 0, 'SIGKILL');
      expect(cluster.fork).to.have.been.calledThrice;
    });

    it('Should let a worker when exited != 0', () => {
      const w = new libCluster.Master(2);

      w.restart({ process: { pid: -1 } }, 15, null);
      expect(cluster.fork).to.have.been.calledTwice;
    });

    it('Should not restart worker after teardown', () => {
      const w = new libCluster.Master(2);

      w.teardown();
      w.restart(null, 0, null);
      expect(cluster.fork).to.have.been.calledTwice;
    });
  });
});
