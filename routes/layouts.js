const express = require('express');
const router = express.Router();
const db = require('../sequelize');

/**
 * 레이아웃 목록 조회 엔드포인트
 * 등록된 레이아웃의 목록을 조회합니다.
 */
router.get('/', async (req, res) => {
    try {
        const layouts = await db.Layouts.findAll();
        res.status(200).json(layouts);
    } catch (err) {
        res.status(500).json({ error: 'Database error', details: err.message });
    }
});

/**
 * 레이아웃 생성 엔드포인트
 * 새로운 레이아웃을 생성합니다.
 */
router.post('/', async (req, res) => {
    const { group_id, layout_name, category, orientation, screen_split, direction, resolution, notes } = req.body;

    try {
        const layout = await db.Layouts.create({
            group_id,
            layout_name,
            category,
            orientation,
            screen_split,
            direction,
            resolution,
            notes,
            register_date: new Date(),
            update_date: new Date()
        });

        res.status(201).json({ message: 'Layout created successfully', layout });
    } catch (err) {
        res.status(500).json({ error: 'Database error', details: err.message });
    }
});

module.exports = router;
