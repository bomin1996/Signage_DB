const request = require('supertest');
const assert = require('assert');
const app = require('../app'); // Express 앱 불러오기

describe('Auth API', () => {
    it('should return a JWT token for valid credentials', (done) => {
        request(app)
            .post('/auth/login')
            .send({ username: 'user', password: 'pass' })
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                assert.ok(res.body.token);
                done();
            });
    });

    it('should return 401 for invalid credentials', (done) => {
        request(app)
            .post('/auth/login')
            .send({ username: 'invalid', password: 'invalid' })
            .expect(401)
            .end((err, res) => {
                if (err) return done(err);
                assert.strictEqual(res.body.message, 'Invalid credentials');
                done();
            });
    });



    it('should return 400 for missing credentials', (done) => {
        request(app)
            .post('/auth/login')
            .send({ username: '', password: '' })
            .expect(400)
            .end((err, res) => {
                if (err) return done(err);
                assert.ok(res.body.errors);
                done();
            });
    });
});
