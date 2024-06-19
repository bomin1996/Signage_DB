const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const ffmpeg = require('fluent-ffmpeg');
const ffmpegInstaller = require('@ffmpeg-installer/ffmpeg');
const ffprobeInstaller = require('@ffprobe-installer/ffprobe');
const fs = require('fs');
const db = require('../sequelize'); // assuming Sequelize is set up for DB

// ffmpeg 설정
ffmpeg.setFfmpegPath(ffmpegInstaller.path);
ffmpeg.setFfprobePath(ffprobeInstaller.path);

// Multer 설정
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/videos');
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// 동영상 업로드 및 메타데이터 추출, 썸네일 생성
router.post('/upload', upload.single('video'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    const videoPath = req.file.path;
    const thumbnailPath = `public/uploads/thumbnails/${path.basename(req.file.filename, path.extname(req.file.filename))}.png`;

    // 메타데이터 추출
    ffmpeg.ffprobe(videoPath, (err, metadata) => {
        if (err) {
            return res.status(500).json({ error: 'Error retrieving metadata', details: err.message });
        }

        const videoMetadata = {
            format: metadata.format,
            streams: metadata.streams
        };

        // 썸네일 생성
        ffmpeg(videoPath)
            .on('end', function () {
                console.log('Screenshots taken');

                // DB에 저장 (예: Sequelize를 사용하여 DB에 저장)
                db.Videos.create({
                    filename: req.file.filename,
                    path: videoPath,
                    thumbnail: thumbnailPath,
                    metadata: videoMetadata
                }).then(() => {
                    res.status(200).json({
                        message: 'Video uploaded, thumbnail generated, and metadata extracted successfully',
                        videoPath: videoPath,
                        thumbnailPath: thumbnailPath,
                        metadata: videoMetadata
                    });
                }).catch(err => {
                    res.status(500).json({ error: 'Database error', details: err.message });
                });
            })
            .on('error', function (err) {
                console.error(err);
                res.status(500).json({ error: 'Error generating thumbnail', details: err.message });
            })
            .screenshots({
                count: 1,
                folder: 'public/uploads/thumbnails',
                filename: path.basename(thumbnailPath),
                size: '320x240'
            });
    });
});

module.exports = router;
