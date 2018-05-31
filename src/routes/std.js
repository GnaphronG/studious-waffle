const Router = require('koa-router');
const health = require('../controllers/health');

const router = new Router();

router.get('/ping', ctx => (ctx.body = 'pong'));
router.get(
  '/version',
  ctx => (ctx.body = require(`${__dirname}/../../version.json`))
);
router.get('/health', health);

module.exports = router;
