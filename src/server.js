const fs = require('fs');
const app = require('./app');
const logger = require('./lib/logger');
const io = require('socket.io');
const { server: config } = require('config');
const { name: appName } = require('./lib/package');

let server = null;

function shutdown() {
  logger.info('Shutting down server');
  // start graceful shutdown here
  server.close(err => {
    /* istanbul ignore if */
    if (err) {
      logger.error(err, `Server Error: ${err.message}`);
      process.exit(1);
    } else {
      logger.info('Server Shutdown .');
      process.exit(0);
    }
  });
}

/* istanbul ignore next */
switch (config.protocol.toLowerCase()) {
  case 'http2':
    server = require('http2').createSecureServer(
      {
        allowHTTP1: true,
        key: fs.readFileSync(config.keyFile),
        cert: fs.readFileSync(config.certFile),
      },
      app.callback()
    );
    break;
  case 'https':
    server = require('https').createServer(
      {
        key: fs.readFileSync(config.keyFile),
        cert: fs.readFileSync(config.certFile),
      },
      app.callback()
    );
    break;
  default:
    server = require('http').createServer(app.callback());
}

config.stopSignals.forEach(signal => process.on(signal, shutdown));

const s = io(server);
s.on('connection', function(socket){
    console.log('a user connected');
    socket.on('disconnect', function(){
        console.log('user disconnected');
    });
    socket.on('chat message', function(msg){
        console.log('message: ' + msg);
        s.emit('chat message', `Message: ${msg}`);
    });
});
/* istanbul ignore next */
server.listen(config.port, e => {
  if (e) {
    logger.error(e, `Server start failed : ${e.message}`);
  } else {
    logger.info(`${appName} is now listening on ${config.port}`);
  }
});
