const Koa = require('koa');
const request = require('supertest');
const middlewares = require('../src/lib/middlewares');


describe('Middlewares', () => {
    describe('Pragma', () => {
        const app = new Koa();
        let service = null;

        before(() => {
            app.use(middlewares.pragma());
            app.use(async ctx => ctx.body = 'Hello World');
            service = app.listen(0);
        });

        after(() => {
            service.close();
        });

        it('Should return hello world', async () => {
            await request(service)
                .get('/')
                .expect('Content-Type', /text/)
                .expect(200)
                .expect('Hello World')
                .expect(res => expect(res.headers['x-request-id']).to.not.exist);
        });

        it('Should return hello world with request Id', async () => {
            await request(service)
                .get('/')
                .set('Pragma', 'X-Request-Id')
                .expect('Content-Type', /text/)
                .expect(200)
                .expect('Hello World')
                .expect(res => expect(res.headers['x-request-id']).to.exist);
        });
    });
});
