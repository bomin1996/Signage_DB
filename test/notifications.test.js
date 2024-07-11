const request = require('supertest');
const assert = require('assert');
const app = require('../app'); // Express 앱 불러오기
const fs = require('fs');
const path = require('path');

// 알림 파일 경로
const notificationsFilePath = path.join(__dirname, '../data/notifications.json');

// 알림 디렉토리 경로
const notificationsDirPath = path.join(__dirname, '../data');

// 테스트 전에 알림 파일을 초기화하는 유틸리티 함수
const initializeNotificationsFile = () => {
    // 알림 디렉토리가 존재하지 않으면 생성
    if (!fs.existsSync(notificationsDirPath)) {
        fs.mkdirSync(notificationsDirPath);
    }
    if (fs.existsSync(notificationsFilePath)) {
        fs.unlinkSync(notificationsFilePath); // 기존 파일 삭제
    }
    fs.writeFileSync(notificationsFilePath, JSON.stringify([])); // 빈 배열로 초기화
};

describe('Notifications API', () => {
    beforeEach(() => {
        initializeNotificationsFile(); // 각 테스트 전에 파일 초기화
    });

    describe('POST /notifications', () => {
        it('should create a new notification', (done) => {
            request(app)
                .post('/notifications')
                .send({
                    message: 'Test notification',
                    level: 'info',
                    recipient: 'testuser@example.com'
                })
                .expect(201)
                .end((err, res) => {
                    if (err) return done(err);
                    assert.strictEqual(res.body.message, 'Notification created successfully');
                    assert.ok(res.body.notification);
                    assert.strictEqual(res.body.notification.message, 'Test notification');
                    done();
                });
        });
    });

    describe('GET /notifications', () => {
        it('should get a list of notifications', (done) => {
            // 알림을 미리 생성
            const notifications = [
                { id: 1, message: 'First notification', level: 'info', recipient: 'user1@example.com', timestamp: new Date() },
                { id: 2, message: 'Second notification', level: 'warning', recipient: 'user2@example.com', timestamp: new Date() }
            ];
            fs.writeFileSync(notificationsFilePath, JSON.stringify(notifications));

            request(app)
                .get('/notifications')
                .expect(200)
                .end((err, res) => {
                    if (err) return done(err);
                    assert.ok(Array.isArray(res.body));
                    assert.strictEqual(res.body.length, 2);
                    assert.strictEqual(res.body[0].message, 'First notification');
                    assert.strictEqual(res.body[1].message, 'Second notification');
                    done();
                });
        });
    });
});
