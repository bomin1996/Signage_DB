const request = require('supertest');
const assert = require('assert');
const app = require('../app'); // Express 앱 불러오기
const db = require('../sequelize'); // Sequelize 인스턴스 불러오기

describe('Schedules API', () => {
    let createdScheduleId;

    // 테스트 데이터베이스 초기화
    before(async () => {
        // 필요한 경우, 테스트에 사용할 데이터를 미리 생성합니다.
        try {
            await db.Contents.create({ title: 'Test Content', description: 'This is a test content' });
        } catch (err) {
            console.error('Error creating content:', err);
        }
    });

    describe('POST /schedules', () => {
        it('should create a new schedule', (done) => {
            request(app)
                .post('/schedules')
                .send({
                    content_id: 1, // 위에서 생성한 콘텐츠의 ID를 사용합니다.
                    start_time: '2024-07-01T10:00:00Z',
                    end_time: '2024-07-01T12:00:00Z'
                })
                .expect(201)
                .end((err, res) => {
                    if (err) return done(err);
                    assert.strictEqual(res.body.message, 'Schedule created successfully');
                    assert.ok(res.body.schedule);
                    createdScheduleId = res.body.schedule.schedule_id;
                    done();
                });
        });
    });

    describe('GET /schedules', () => {
        it('should get a list of registered schedules', (done) => {
            request(app)
                .get('/schedules')
                .expect(200)
                .end((err, res) => {
                    if (err) return done(err);
                    assert.ok(Array.isArray(res.body));
                    assert.ok(res.body.length > 0);
                    done();
                });
        });
    });

    describe('DELETE /schedules/:scheduleId', () => {
        it('should delete a specific schedule', (done) => {
            request(app)
                .delete(`/schedules/${createdScheduleId}`)
                .expect(200)
                .end((err, res) => {
                    if (err) return done(err);
                    assert.strictEqual(res.body.message, 'Schedule deleted successfully');
                    done();
                });
        });
    });
});
