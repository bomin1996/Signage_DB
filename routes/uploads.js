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
        // 파일 이름에 고유 식별자를 추가하여 저장
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.originalname + '-' + uniqueSuffix);
    }
});

const upload = multer({ storage: storage });

// 파일 업로드 엔드포인트
router.post('/upload', upload.single('image'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    // 원래 파일 이름과 실제 저장된 파일 이름을 구분하여 저장
    const originalFileName = req.file.originalname;
    const savedFileName = req.file.filename;
    const filePath = `/uploads/${req.file.filename}`;
    const fileType = req.file.mimetype;
    const fileSize = req.file.size;

    try {
        // 데이터베이스에 파일 정보 저장
        const content = await db.Contents.create({
            file_name: originalFileName,
            saved_file_name: savedFileName,
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
