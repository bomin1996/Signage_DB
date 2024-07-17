const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');

// 사용자 인증을 처리하는 예시 엔드포인트
router.post('/login', [
    body('username').notEmpty(),
    body('password').notEmpty()
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { username, password } = req.body;
    // 사용자 인증 로직 (여기서는 간단한 예시)
    if (username === 'user' && password === 'pass') {
        const token = jwt.sign({ username }, 'secret_key');
        return res.json({ token });
    }

    res.status(401).json({ message: 'Invalid credentials' });
});

module.exports = router;
