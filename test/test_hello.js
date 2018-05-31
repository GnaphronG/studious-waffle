const request = require('supertest');
const app = require('../src/app');


describe('/hello', () => {
    let service = null;

    before(() => {
        service = app.listen(0);
    });

    after(() => {
        service.close();
    });

    it('Should return "world!"', async () => {
        await request(service)
            .get('/v1/hello')
            .expect('Content-Type', /json/)
            .expect(200)
            .expect({hello: 'world!'})
    });
});
