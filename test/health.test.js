const request = require('supertest');
const assert = require('assert');
const app = require('../app'); // Express 앱 불러오기

describe('Health API', () => {
    describe('GET /health', () => {
        it('should get a status of UP', (done) => {
            request(app)
                .get('/health')
                .expect(200)
                .end((err, res) => {
                    if (err) return done(err);
                    assert.strictEqual(res.body.status, 'UP');
                    assert.ok(res.body.timestamp);
                    done();
                });
        });
    });

    describe('GET /health/detailed-health', () => {
        it('should get a detailed status of UP', (done) => {
            request(app)
                .get('/health/detailed-health')
                .expect(200)
                .end((err, res) => {
                    if (err) return done(err);
                    assert.strictEqual(res.body.status, 'UP');
                    assert.strictEqual(res.body.services.database, 'UP');
                    assert.ok(res.body.timestamp);
                    done();
                });
        });
    });
});
