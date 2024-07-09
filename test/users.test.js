const request = require('supertest');
const assert = require('assert');
const app = require('../app'); // Express 앱 불러오기

describe('Users API', () => {
    let createdUserId;

    // 테스트 데이터베이스에 그룹 생성
    before(async () => {
        try {
            await db.Groups.create({ group_name: 'Test Group' });
        } catch (err) {
            console.error('Error creating group:', err);
        }
    });

    describe('POST /users', () => {
        it('should create a new user', (done) => {
            request(app)
                .post('/users')
                .send({
                    group_id: 1, // Test Group의 ID를 사용합니다.
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
                    createdUserId = res.body.user.user_id;
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
                    done();
                });
        });
    });

    describe('PUT /users/:userId', () => {
        it('should update a user\'s information', (done) => {
            request(app)
                .put(`/users/${createdUserId}`)
                .send({
                    group_id: 1,
                    user_type: 'admin',
                    name: 'Updated User',
                    username: 'updateduser',
                    password: 'newpassword123',
                    contact: '987-654-3210'
                })
                .expect(200)
                .end((err, res) => {
                    if (err) return done(err);
                    assert.strictEqual(res.body.message, 'User updated successfully');
                    assert.strictEqual(res.body.user.name, 'Updated User');
                    done();
                });
        });
    });

    describe('DELETE /users/:userId', () => {
        it('should delete a specific user', (done) => {
            request(app)
                .delete(`/users/${createdUserId}`)
                .expect(200)
                .end((err, res) => {
                    if (err) return done(err);
                    assert.strictEqual(res.body.message, 'User deleted successfully');
                    done();
                });
        });
    });
});
