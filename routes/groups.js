const express = require('express');
const router = express.Router();
const db = require('../sequelize');

// Create a new group
router.post('/', async (req, res) => {
    const { group_name } = req.body;
    try {
        const group = await db.Groups.create({ group_name });
        res.status(201).json({ message: 'Group created successfully', group });
    } catch (err) {
        res.status(500).json({ error: 'Database error', details: err.message });
    }
});

// Get a list of groups
router.get('/', async (req, res) => {
    try {
        const groups = await db.Groups.findAll();
        res.status(200).json(groups);
    } catch (err) {
        res.status(500).json({ error: 'Database error', details: err.message });
    }
});

module.exports = router;
