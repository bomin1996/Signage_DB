const express = require('express');
const router = express.Router();
const db = require('../sequelize');

//사용자 목록 조회 엔드포인트 등록된 사용자의 목록을 조회합니다.
router.get('/', async (req, res) => {
  try {
    const users = await db.Users.findAll();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: 'Database error', details: err.message });
  }
});

//사용자 삭제 엔드포인트 특정 사용자를 삭제합니다.
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

module.exports = router;
