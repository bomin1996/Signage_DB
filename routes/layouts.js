const express = require('express');
const router = express.Router();
const db = require('../sequelize');

// 새로운 레이아웃을 생성
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

// 등록된 레이아웃의 목록을 조회
router.get('/', async (req, res) => {
    try {
        const layouts = await db.Layouts.findAll();
        res.status(200).json(layouts);
    } catch (err) {
        res.status(500).json({ error: 'Database error', details: err.message });
    }
});

// 특정 레이아웃을 삭제
router.delete('/:layoutId', async (req, res) => {
    const layoutId = req.params.layoutId;

    try {
        const layout = await db.Layouts.findByPk(layoutId);

        if (!layout) {
            return res.status(404).json({ error: 'Layout not found' });
        }

        await db.Layouts.destroy({ where: { layout_id: layoutId } });

        res.status(200).json({ message: 'Layout deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Database error', details: err.message });
    }
});


// 특정 레이아웃의 정보를 업데이트
router.put('/:layoutId', async (req, res) => {
    const layoutId = req.params.layoutId;
    const { group_id, layout_name, category, orientation, screen_split, direction, resolution, notes } = req.body;

    try {
        const layout = await db.Layouts.findByPk(layoutId);

        if (!layout) {
            return res.status(404).json({ error: 'Layout not found' });
        }

        layout.group_id = group_id || layout.group_id;
        layout.layout_name = layout_name || layout.layout_name;
        layout.category = category || layout.category;
        layout.orientation = orientation || layout.orientation;
        layout.screen_split = screen_split || layout.screen_split;
        layout.direction = direction || layout.direction;
        layout.resolution = resolution || layout.resolution;
        layout.notes = notes || layout.notes;
        layout.update_date = new Date();

        await layout.save();

        res.status(200).json({ message: 'Layout updated successfully', layout });
    } catch (err) {
        res.status(500).json({ error: 'Database error', details: err.message });
    }
});

module.exports = router;
