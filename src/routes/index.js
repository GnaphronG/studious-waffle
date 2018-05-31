const Router = require('koa-router');
const stdRouter = require('./std');
const v1Router = require('./v1');
const router = new Router();
const fs = require('fs');
const util = require('util');

router.use(stdRouter.routes());
router.use('/v1', v1Router.routes());

const readfile = util.promisify(fs.readFile);

router.get('/', async ctx => {
    ctx.type = 'text/html';
    ctx.body = await readfile(`${__dirname}/../views/index.html`);
});

module.exports = router;
