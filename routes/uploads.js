const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const db = require('../sequelize');

// Multer 설정
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// 파일 업로드 엔드포인트
router.post('/upload', upload.single('image'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    const fileName = req.file.filename;
    const filePath = `/uploads/${req.file.filename}`;
    const fileType = req.file.mimetype;
    const fileSize = req.file.size;

    try {
        // 데이터베이스에 파일 정보 저장
        const content = await db.Contents.create({
            file_name: fileName,
            file_type: fileType,
            file_size: fileSize,
            file_path: filePath
        });

        res.status(200).json({ message: 'File uploaded successfully', filePath: filePath });
    } catch (err) {
        res.status(500).json({ error: 'Database error', details: err.message });
    }
});

module.exports = router;
