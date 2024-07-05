const express = require('express');
const router = express.Router();
const db = require('../sequelize'); // db를 추가하여 사용합니다.

// Health Check endpoint
router.get('/', (req, res) => {
    res.status(200).json({ status: 'UP', timestamp: new Date() });
});

// Detailed Health Check endpoint
router.get('/detailed-health', async (req, res) => {
    try {
        // 데이터베이스 연결 상태 확인
        await db.sequelize.authenticate();
        res.status(200).json({ status: 'UP', services: { database: 'UP' }, timestamp: new Date() });
    } catch (err) {
        console.error('Database connection error:', err);
        res.status(500).json({ status: 'DOWN', services: { database: 'DOWN' }, timestamp: new Date(), details: err.message });
    }
});

module.exports = router;
