const logger = require('../lib/logger');
const { hostname } = require('os');
const { services } = require('config');
const { name, version } = require('../lib/package');

const Timeout = 100;
const server = { name, version, hostname: hostname() };
const dependsOn = Object.keys(services);
const srvs = dependsOn.map(dep => require(`../services/${dep}`));

const timeout = delay => new Promise(resolve => setTimeout(resolve, delay));

async function wrap(p) {
  try {
    await p();
    return true;
  } catch (e) {
    logger.error(e, 'Healthcheck failed : ', e.message);
    return false;
  }
}

async function health(ctx) {
  let up = true;
  const depChecks = Promise.all(srvs.map(srv => wrap(srv.health)));
  const checks = await Promise.race([depChecks, timeout(Timeout)]);
  const res = dependsOn.reduce(
    (acc, srv, idx) => ((acc[srv] = checks ? checks[idx] : 'timeout'), (up &= !!checks && !!checks[idx]), acc),
    {}
  );

  ctx.set('Cache-Control', 'no-cache');
  ctx.body = Object.assign(
    { status: up ? 'up' : 'down' },
    { server, dependencies: res }
  );
}

module.exports = health;
