const request = require('supertest');
const assert = require('assert');
const app = require('../app'); // Express 앱 불러오기
const db = require('../sequelize');

describe('Users API', () => {
    before(async () => {
        // 데이터베이스 초기화
        await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
        await db.sequelize.sync({ force: true });
        await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 1');

        // 그룹 데이터 삽입 (외래 키 제약 조건 문제 해결)
        await db.Groups.create({ group_id: 1, group_name: 'Group 1' });
    });

    describe('POST /users', () => {
        it('should create a new user', (done) => {
            request(app)
                .post('/users')
                .send({
                    group_id: 1,
                    user_type: 'admin',
                    name: 'Test User',
                    username: 'testuser',
                    password: 'password123',
                    contact: '123-456-7890'
                })
                .expect(201)
                .end((err, res) => {
                    if (err) return done(err);
                    assert.strictEqual(res.body.message, 'User created successfully');
                    assert.ok(res.body.user);
                    assert.strictEqual(res.body.user.username, 'testuser');
                    done();
                });
        });
    });

    describe('GET /users', () => {
        it('should get a list of registered users', (done) => {
            request(app)
                .get('/users')
                .expect(200)
                .end((err, res) => {
                    if (err) return done(err);
                    assert.ok(Array.isArray(res.body));
                    assert.strictEqual(res.body.length, 1);
                    assert.strictEqual(res.body[0].username, 'testuser');
                    done();
                });
        });
    });

    describe('PUT /users/:userId', () => {
        it('should update a user\'s information', (done) => {
            request(app)
                .put('/users/1')
                .send({
                    user_type: 'user',
                    name: 'Updated User',
                    username: 'updateduser',
                    password: 'newpassword123',
                    contact: '987-654-3210'
                })
                .expect(200)
                .end((err, res) => {
                    if (err) return done(err);
                    assert.strictEqual(res.body.message, 'User updated successfully');
                    done();
                });
        });
    });

    describe('DELETE /users/:userId', () => {
        it('should delete a specific user', (done) => {
            request(app)
                .delete('/users/1')
                .expect(200)
                .end((err, res) => {
                    if (err) return done(err);
                    assert.strictEqual(res.body.message, 'User deleted successfully');
                    done();
                });
        });
    });
});
