const Koa = require('koa');
const koaLogger = require('koa-bunyan-logger');
const logger = require('./lib/logger');
const middlewares = require('./lib/middlewares');
const router = require('./routes');
const app = new Koa();

app.use(koaLogger(logger));
app.use(koaLogger.requestIdContext());
app.use(koaLogger.timeContext());
app.use(koaLogger.requestLogger());

app.use(middlewares.pragma())

app.use(router.routes());
app.use(router.allowedMethods());

module.exports = app;
