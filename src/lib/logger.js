const bunyan = require('bunyan');
const config = require('config');

const logger = bunyan.createLogger({
  name: process.title,
  level: config.log.level || /* istanbul ignore next */ 'debug',
  serializers: bunyan.stdSerializers,
});

module.exports = logger;
