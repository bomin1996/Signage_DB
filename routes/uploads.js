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
        const uploadPath = path.join(__dirname, '../public/uploads');
        const originalFileName = file.originalname;
        let fileName = originalFileName;

        // 파일 이름 중복 처리
        if (fs.existsSync(path.join(uploadPath, fileName))) {
            const fileExt = path.extname(fileName);
            const baseName = path.basename(fileName, fileExt);
            let counter = 1;

            while (fs.existsSync(path.join(uploadPath, fileName))) {
                fileName = `${baseName}-${counter}${fileExt}`;
                counter++;
            }
        }

        cb(null, fileName);
    }
});

const upload = multer({ storage: storage });

// 파일 업로드 엔드포인트
router.post('/upload', upload.single('image'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    const fileName = req.file.filename;
    const filePath = `/uploads/${fileName}`;
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
