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

// Get details of a specific group
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const group = await db.Groups.findByPk(id);
        if (group) {
            res.status(200).json(group);
        } else {
            res.status(404).json({ error: 'Group not found' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Database error', details: err.message });
    }
});

// Update a specific group
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { group_name } = req.body;
    try {
        const group = await db.Groups.findByPk(id);
        if (group) {
            group.group_name = group_name;
            await group.save();
            res.status(200).json({ message: 'Group updated successfully', group });
        } else {
            res.status(404).json({ error: 'Group not found' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Database error', details: err.message });
    }
});

// Delete a specific group
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const group = await db.Groups.findByPk(id);
        if (group) {
            await group.destroy();
            res.status(200).json({ message: 'Group deleted successfully' });
        } else {
            res.status(404).json({ error: 'Group not found' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Database error', details: err.message });
    }
});

module.exports = router;