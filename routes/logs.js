const express = require('express');
const router = express.Router();
const db = require('../sequelize');

// 로그 기록을 추가
router.post('/', async (req, res) => {
    const { level, message, details, timestamp } = req.body;

    try {
        const log = await db.Logs.create({
            level,
            message,
            details, // 추가적인 상세 설명 필드
            timestamp: timestamp || new Date()
        });

        res.status(201).json({ message: 'Log created successfully', log });
    } catch (err) {
        res.status(500).json({ error: 'Database error', details: err.message });
    }
});

// 로그 목록을 조회
router.get('/', async (req, res) => {
    try {
        const logs = await db.Logs.findAll();
        const formattedLogs = logs.map(log => ({
            id: log.id,
            level: log.level,
            message: log.message,
            details: log.details, // 추가적인 상세 설명 필드
            timestamp: log.timestamp,
            readableMessage: `${log.timestamp.toISOString()} [${log.level.toUpperCase()}]: ${log.message} - ${log.details || ''}`
        }));
        res.status(200).json(formattedLogs);
    } catch (err) {
        res.status(500).json({ error: 'Database error', details: err.message });
    }
});

module.exports = router;
