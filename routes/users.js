const express = require('express');
const router = express.Router();
const db = require('../sequelize');

// 새로운 사용자를 등록
router.post('/', async (req, res) => {
  const { group_id, user_type, name, username, password, contact } = req.body;

  try {
    const user = await db.Users.create({
      group_id,
      user_type,
      name,
      username,
      password,
      contact
    });

    res.status(201).json({ message: 'User created successfully', user });
  } catch (err) {
    res.status(500).json({ error: 'Database error', details: err.message });
  }
});

// 등록된 사용자의 목록을 조회
router.get('/', async (req, res) => {
  try {
    const users = await db.Users.findAll();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: 'Database error', details: err.message });
  }
});

// 특정 사용자를 삭제
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

// 사용자의 정보를 업데이트
router.put('/:userId', async (req, res) => {
  const userId = req.params.userId;
  const { group_id, user_type, name, username, password, contact } = req.body;

  try {
    const user = await db.Users.findByPk(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.group_id = group_id || user.group_id;
    user.user_type = user_type || user.user_type;
    user.name = name || user.name;
    user.username = username || user.username;
    user.password = password || user.password;
    user.contact = contact || user.contact;

    await user.save();

    res.status(200).json({ message: 'User updated successfully', user });
  } catch (err) {
    res.status(500).json({ error: 'Database error', details: err.message });
  }
});

module.exports = router;
