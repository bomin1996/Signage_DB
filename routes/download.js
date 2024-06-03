const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const db = require('../sequelize');

router.get('/:fileId', async (req, res) => {
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
