const logger = require('../src/lib/logger');

describe('lib/logger', () => {
  it('Should create a logger', () => {
    expect(logger).to.be.an('object');
  });

  it('Should contains expected log levels', () => {
    const levels = ['debug', 'info', 'error', 'warn'];

    levels.forEach(level => expect(logger[level]).to.be.a('function'));
  });
});
