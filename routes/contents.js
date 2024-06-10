const express = require('express');
const router = express.Router();
const multer = require('multer'); // multer 모듈 불러오기
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

// 파일을 업로드하고 메타데이터를 DB에 저장
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

// 업로드된 콘텐츠의 목록을 조회
router.get('/', async (req, res) => {
    try {
        const contents = await db.Contents.findAll();
        res.status(200).json(contents);
    } catch (err) {
        res.status(500).json({ error: 'Database error', details: err.message });
    }
});

// 특정 콘텐츠를 삭제
router.delete('/:contentId', async (req, res) => {
    const contentId = req.params.contentId;

    try {
        const content = await db.Contents.findByPk(contentId);

        if (!content) {
            return res.status(404).json({ error: 'File not found' });
        }

        const filePath = path.join(__dirname, '../public/uploads', content.file_name);

        fs.unlink(filePath, async (err) => {
            if (err) {
                return res.status(500).json({ error: 'File deletion error', details: err.message });
            }

            await db.Contents.destroy({ where: { content_id: contentId } });

            res.status(200).json({ message: 'File deleted successfully' });
        });
    } catch (err) {
        res.status(500).json({ error: 'Database error', details: err.message });
    }
});

// 특정 파일을 다운로드
router.get('/download/:contentId', async (req, res) => {
    const contentId = req.params.contentId;

    try {
        const content = await db.Contents.findByPk(contentId);

        if (!content) {
            return res.status(404).json({ error: 'File not found' });
        }

        const filePath = path.join(__dirname, '../public/uploads', content.file_name);
        const fileName = content.file_name;

        res.download(filePath, fileName, (err) => {
            if (err) {
                res.status(500).json({ error: 'File download error', details: err.message });
            }
        });
    } catch (err) {
        res.status(500).json({ error: 'Database error', details: err.message });
    }
});

module.exports = router;
