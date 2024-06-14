const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

// 알림 파일 경로
const notificationsFilePath = path.join(__dirname, '../data/notifications.json');

// 알림 파일에서 데이터 읽기
const readNotificationsFromFile = () => {
    if (fs.existsSync(notificationsFilePath)) {
        const notifications = fs.readFileSync(notificationsFilePath);
        return JSON.parse(notifications);
    }
    return [];
};

// 알림 파일에 데이터 쓰기
const writeNotificationsToFile = (notifications) => {
    fs.writeFileSync(notificationsFilePath, JSON.stringify(notifications, null, 2));
};

// 새로운 알림을 추가
router.post('/', (req, res) => {
    const { message, level, recipient } = req.body;

    const notifications = readNotificationsFromFile();

    const notification = {
        id: notifications.length + 1,
        message,
        level,
        recipient,
        timestamp: new Date()
    };

    notifications.push(notification);
    writeNotificationsToFile(notifications);

    // 여기에서 알림 전송 로직을 추가할 수 있습니다 (예: 이메일, SMS, 푸시 알림 등)
    console.log(`Notification sent to ${recipient}: ${message}`);

    res.status(201).json({ message: 'Notification created successfully', notification });
});

// 알림 목록을 조회
router.get('/', (req, res) => {
    const notifications = readNotificationsFromFile();
    res.status(200).json(notifications);
});

module.exports = router;
