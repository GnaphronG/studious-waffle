const cluster = require('cluster');
const logger = require('../logger');
const { stopSignals } = require('./constants');

class Master {
  constructor(workers) {
    this.isUp = true;

    for (let i = 0; i < workers; i++) {
      cluster.fork();
    }
    logger.info({ pid: process.pid }, `${process.title} is starting`);

    stopSignals.forEach(signal => process.on(signal, this.teardown.bind(this)));
    cluster.on('exit', this.restart.bind(this));
    cluster.on('listening', this.listening.bind(this));
  }

  get workers() {
    return Object.keys(cluster.workers).length;
  }

  teardown() {
    this.isUp = false;
    const workers = this.workers;

    cluster.disconnect();

    // Console is there because at this step we have no evenloop and need to be synchronous
    // eslint-disable-next-line no-console
    process.on('exit', () => console.log(`Bye .${'.'.repeat(workers)}`));
  }

  restart(worker, code, signal) {
    if (!(code === 0 || stopSignals.includes(signal))) {
      logger.error(
        { pid: worker.process.pid },
        `Worker exited with code ${code} on ${signal}`
      );
    } else if (this.isUp) {
      cluster.fork();
    }
  }

  listening(worker, address) {
    if (address.address === null) {
      address.address = '0.0.0.0';
    }
    logger.info(address, `Listening to ${address.address}:${address.port}`);
  }
}

module.exports = Master;
