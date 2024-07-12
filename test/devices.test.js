const request = require('supertest');
const assert = require('assert');
const app = require('../app'); // Express 앱 불러오기
const db = require('../sequelize');

describe('Devices API', () => {
    before(async () => {
        await db.sequelize.sync({ force: true }); // 데이터베이스 초기화
        // 그룹 데이터 삽입 (외래 키 제약 조건 문제 해결)
        await db.Groups.create({ group_id: 1, group_name: 'Group 1' });
    });

    describe('POST /devices', () => {
        it('should create a new device', (done) => {
            request(app)
                .post('/devices')
                .send({
                    device_id: '12345',
                    group_name: 'Group 1',
                    status: 'active',
                    os: 'Android',
                    device_name: 'Device A',
                    ip_address: '192.168.1.1'
                })
                .expect(201)
                .end((err, res) => {
                    if (err) return done(err);
                    assert.strictEqual(res.body.message, 'Device created successfully');
                    assert.ok(res.body.device);
                    assert.strictEqual(res.body.device.device_id, '12345');
                    done();
                });
        });
    });

    describe('GET /devices', () => {
        it('should get a list of registered devices', (done) => {
            request(app)
                .get('/devices')
                .expect(200)
                .end((err, res) => {
                    if (err) return done(err);
                    assert.ok(Array.isArray(res.body));
                    assert.strictEqual(res.body.length, 1);
                    assert.strictEqual(res.body[0].device_id, '12345');
                    done();
                });
        });
    });

    describe('PUT /devices/:deviceId', () => {
        it('should update a device\'s information', (done) => {
            request(app)
                .put('/devices/12345')
                .send({
                    status: 'inactive',
                    os: 'iOS',
                    device_name: 'Device B',
                    ip_address: '192.168.1.2'
                })
                .expect(200)
                .end((err, res) => {
                    if (err) return done(err);
                    assert.strictEqual(res.body.message, 'Device updated successfully');
                    done();
                });
        });
    });

    describe('DELETE /devices/:deviceId', () => {
        it('should delete a specific device', (done) => {
            request(app)
                .delete('/devices/12345')
                .expect(200)
                .end((err, res) => {
                    if (err) return done(err);
                    assert.strictEqual(res.body.message, 'Device deleted successfully');
                    done();
                });
        });
    });
});
