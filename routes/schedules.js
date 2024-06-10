const express = require('express');
const router = express.Router();
const db = require('../sequelize');

// 새로운 스케줄을 생성
router.post('/', async (req, res) => {
    const { content_id, start_time, end_time } = req.body;

    try {
        const schedule = await db.Schedules.create({
            content_id,
            start_time,
            end_time
        });

        res.status(201).json({ message: 'Schedule created successfully', schedule });
    } catch (err) {
        res.status(500).json({ error: 'Database error', details: err.message });
    }
});

// 등록된 스케줄의 목록을 조회
router.get('/', async (req, res) => {
    try {
        const schedules = await db.Schedules.findAll();
        res.status(200).json(schedules);
    } catch (err) {
        res.status(500).json({ error: 'Database error', details: err.message });
    }
});

// 특정 스케줄을 삭제
router.delete('/:scheduleId', async (req, res) => {
    const scheduleId = req.params.scheduleId;

    try {
        const schedule = await db.Schedules.findByPk(scheduleId);

        if (!schedule) {
            return res.status(404).json({ error: 'Schedule not found' });
        }

        await db.Schedules.destroy({ where: { schedule_id: scheduleId } });

        res.status(200).json({ message: 'Schedule deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Database error', details: err.message });
    }
});

module.exports = router;
