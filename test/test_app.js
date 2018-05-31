const request = require('supertest');
const version = require('../version.json');
const app = require('../src/app');


describe('Application', () => {
    let service = null;

    before(() => {
        service = app.listen(0);
    });

    after(() => {
        service.close();
    });

    it('Should respond "pong" to /ping', async () => {
        await request(service)
            .get('/ping')
            .expect('Content-Type', /text\/plain/)
            .expect(200, 'pong');
    });

    it('Should respond "./version.json" to /version', async () => {
        await request(service)
            .get('/version')
            .expect('Content-Type', /json/)
            .expect(200, version);
    });

    describe('/health', () => {
        it('Should return the heath of the system', async () => {
            await request(service)
                .get('/health')
                .expect('Content-Type', /json/)
                .expect('Cache-Control', 'no-cache')
                .expect(200)
                .expect((res) => {
                    expect(res.body).to.have.all.keys('status', 'server');
                    expect(res.body.status.toLowerCase()).to.be.eql('up');
                    expect(res.body.server).to.have.all.keys('name', 'version', 'hostname');
                });
        });
    });

});
