const logger = require('../logger');
const { stopSignals } = require('./constants');

class Worker {
  constructor(app, ...args) {
    this.server = app.listen(...args, err => {
      if (err) {
        logger.error(err, `Error while trying to start server: ${err.message}`);
        process.exit(1);
      }
    });
    stopSignals.forEach(signal => process.on(signal, this.shutdown.bind(this)));

    process.on('message', this.message.bind(this));
  }

  shutdown() {
    logger.info('Shutting down server');
    // start graceul shutdown here
    this.server.close(err => {
      if (err) {
        logger.error(err, `Server Error: ${err.message}`);
        process.exit(1);
      } else {
        logger.info('Server Shutdown .');
        process.exit(0);
      }
    });
  }

  message(msg) {
    switch (msg) {
      case 'stop':
        this.shutdown();
        break;
      default:
        logger.debug('Received message: %s', msg);
    }
  }
}

module.exports = Worker;
