const request = require('supertest');
const assert = require('assert');
const app = require('../app'); // Express 앱 불러오기

describe('Logs API', () => {
    const logData = {
        level: 'info',
        message: '테스트 메시지',
        details: '테스트 상세 설명'
    };

    let createdLogId = null;

    it('should create a new log entry', (done) => {
        request(app)
            .post('/logs')
            .send(logData)
            .expect(201)
            .end((err, res) => {
                if (err) return done(err);
                assert.strictEqual(res.body.message, '로그가 성공적으로 생성되었습니다.');
                assert.ok(res.body.log.id);
                assert.strictEqual(res.body.log.level, logData.level);
                assert.strictEqual(res.body.log.message, logData.message);
                assert.strictEqual(res.body.log.details, logData.details);
                createdLogId = res.body.log.id;
                done();
            });
    });

    it('should get all log entries', (done) => {
        request(app)
            .get('/logs')
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                assert.ok(Array.isArray(res.body));
                assert.ok(res.body.length > 0);
                const logEntry = res.body.find(log => log.id === createdLogId);
                assert.ok(logEntry);
                assert.strictEqual(logEntry.level, logData.level);
                assert.strictEqual(logEntry.message, logData.message);
                assert.strictEqual(logEntry.details, logData.details);
                done();
            });
    });
});
