const request = require('supertest');
const assert = require('assert');
const app = require('../app'); // Express 앱 불러오기
const db = require('../sequelize'); // 시퀄라이즈 인스턴스 불러오기

describe('Schedules API', function () {
    this.timeout(10000); // 테스트 타임아웃 설정 (필요시 조정)

    let contentId = null;
    let scheduleId = null;

    // 테스트 전에 DB 초기화 및 샘플 콘텐츠 생성
    before(async () => {
        // 모든 기존 데이터를 삭제
        await db.Schedules.destroy({ where: {} });
        await db.Contents.destroy({ where: {} });

        // 샘플 콘텐츠 생성
        const content = await db.Contents.create({
            file_name: 'test_image.jpg',
            saved_file_name: 'test_image.jpg',
            file_type: 'image/jpeg',
            file_size: 12345,
            file_path: '/uploads/test_image.jpg'
        });
        contentId = content.content_id;
    });

    // 새로운 스케줄 생성 테스트
    it('새로운 스케줄을 생성해야 합니다.', (done) => {
        request(app)
            .post('/schedules')
            .send({
                content_id: contentId,
                start_time: new Date(),
                end_time: new Date(Date.now() + 3600000) // 1시간 후
            })
            .expect(201)
            .end((err, res) => {
                if (err) return done(err);
                assert.strictEqual(res.body.message, 'Schedule created successfully');
                assert.ok(res.body.schedule);
                scheduleId = res.body.schedule.schedule_id;
                done();
            });
    });

    // 등록된 스케줄 목록 조회 테스트
    it('등록된 스케줄 목록을 조회해야 합니다.', (done) => {
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

    // 특정 스케줄 삭제 테스트
    it('특정 스케줄을 삭제해야 합니다.', (done) => {
        request(app)
            .delete(`/schedules/${scheduleId}`)
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                assert.strictEqual(res.body.message, 'Schedule deleted successfully');
                done();
            });
    });

    // 존재하지 않는 스케줄 삭제 테스트
    it('존재하지 않는 스케줄을 삭제하려고 하면 오류를 반환해야 합니다.', (done) => {
        request(app)
            .delete(`/schedules/99999`) // 존재하지 않는 ID로 테스트
            .expect(404)
            .end((err, res) => {
                if (err) return done(err);
                assert.strictEqual(res.body.error, 'Schedule not found');
                done();
            });
    });

    // 테스트 완료 후 DB 정리
    after(async () => {
        await db.Schedules.destroy({ where: {} });
        await db.Contents.destroy({ where: {} });
    });
});
