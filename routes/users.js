const express = require('express');
const router = express.Router();
const db = require('../sequelize');

// Register a new user
router.post('/', async (req, res) => {
  const { group_id, user_type, name, username, password, contact } = req.body;
  try {
    const user = await db.Users.create({ group_id, user_type, name, username, password, contact });
    res.status(201).json({ message: 'User created successfully', user });
  } catch (err) {
    console.error('Error creating user:', err);
    res.status(500).json({ error: 'Database error', details: err.message });
  }
});

// Get a list of registered users
router.get('/', async (req, res) => {
  try {
    const users = await db.Users.findAll();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: 'Database error', details: err.message });
  }
});

// Delete a specific user
router.delete('/:userId', async (req, res) => {
  const userId = req.params.userId;
  try {
    const user = await db.Users.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    await db.Users.destroy({ where: { user_id: userId } });
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Database error', details: err.message });
  }
});

// Update a user's information
router.put('/:userId', async (req, res) => {
  const userId = req.params.userId;
  const { group_id, user_type, name, username, password, contact } = req.body;
  try {
    const user = await db.Users.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    Object.assign(user, { group_id, user_type, name, username, password, contact });
    await user.save();
    res.status(200).json({ message: 'User updated successfully', user });
  } catch (err) {
    res.status(500).json({ error: 'Database error', details: err.message });
  }
});

module.exports = router;
