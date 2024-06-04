const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const db = require('../sequelize');

//콘텐츠 목록 조회 엔드포인트 업로드된 콘텐츠의 목록을 조회합니다.
router.get('/', async (req, res) => {
    try {
        const contents = await db.Contents.findAll();
        res.status(200).json(contents);
    } catch (err) {
        res.status(500).json({ error: 'Database error', details: err.message });
    }
});

// 콘텐츠 삭제 엔드포인트 특정 콘텐츠를 삭제합니다.
router.delete('/:fileId', async (req, res) => {
    const fileId = req.params.fileId;

    try {
        const content = await db.Contents.findByPk(fileId);

        if (!content) {
            return res.status(404).json({ error: 'File not found' });
        }

        const filePath = path.join(__dirname, '../public/uploads', content.file_name);

        fs.unlink(filePath, async (err) => {
            if (err) {
                return res.status(500).json({ error: 'File deletion error', details: err.message });
            }

            await db.Contents.destroy({ where: { content_id: fileId } });

            res.status(200).json({ message: 'File deleted successfully' });
        });
    } catch (err) {
        res.status(500).json({ error: 'Database error', details: err.message });
    }
});

// 파일 다운로드 엔드포인트 특정 파일을 다운로드합니다.
router.get('/download/:fileId', async (req, res) => {
    const fileId = req.params.fileId;

    try {
        const content = await db.Contents.findByPk(fileId);

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
