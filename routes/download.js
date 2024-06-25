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
            return res.status(404).json({ error: '파일을 찾을 수 없습니다.' });
        }

        const filePath = path.join(__dirname, '../public/uploads', content.file_name);
        const fileName = content.file_name;

        fs.stat(filePath, (err, stats) => {
            if (err) {
                return res.status(500).json({ error: '파일 상태를 확인하는 동안 오류가 발생했습니다.', details: err.message });
            }

            const range = req.headers.range;
            if (!range) {
                // Range 헤더가 없으면 전체 파일을 전송
                res.writeHead(200, {
                    'Content-Type': 'application/octet-stream',
                    'Content-Disposition': `attachment; filename="${fileName}"`,
                    'Content-Length': stats.size
                });
                fs.createReadStream(filePath).pipe(res);
            } else {
                // Range 헤더가 있으면 부분적으로 파일을 전송
                const parts = range.replace(/bytes=/, "").split("-");
                const start = parseInt(parts[0], 10);
                const end = parts[1] ? parseInt(parts[1], 10) : stats.size - 1;

                if (start >= stats.size || end >= stats.size) {
                    // 잘못된 범위 요청
                    res.writeHead(416, {
                        'Content-Range': `bytes */${stats.size}`
                    });
                    return res.end();
                }

                const chunkSize = (end - start) + 1;
                const file = fs.createReadStream(filePath, { start, end });

                res.writeHead(206, {
                    'Content-Range': `bytes ${start}-${end}/${stats.size}`,
                    'Accept-Ranges': 'bytes',
                    'Content-Length': chunkSize,
                    'Content-Type': 'application/octet-stream',
                    'Content-Disposition': `attachment; filename="${fileName}"`
                });

                file.pipe(res);
            }
        });
    } catch (err) {
        res.status(500).json({ error: '데이터베이스 오류가 발생했습니다.', details: err.message });
    }
});

module.exports = router;
