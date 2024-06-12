// routes/logs.js

const express = require('express');
const router = express.Router();
const db = require('../sequelize');

// 로그 기록을 추가
router.post('/', async (req, res) => {
    const { level, message, timestamp } = req.body;

    try {
        const log = await db.Logs.create({
            level,
            message,
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
        res.status(200).json(logs);
    } catch (err) {
        res.status(500).json({ error: 'Database error', details: err.message });
    }
});

module.exports = router;
