const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const ffmpeg = require('fluent-ffmpeg');
const ffmpegInstaller = require('@ffmpeg-installer/ffmpeg');
const ffprobeInstaller = require('@ffprobe-installer/ffprobe');
const fs = require('fs');

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

// 동영상 업로드 및 썸네일 생성
router.post('/upload', upload.single('video'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    const videoPath = req.file.path;
    const thumbnailPath = `public/uploads/thumbnails/${path.basename(req.file.filename, path.extname(req.file.filename))}.png`;

    // 썸네일 생성
    ffmpeg(videoPath)
        .on('end', function () {
            console.log('Screenshots taken');
            res.status(200).json({
                message: 'Video uploaded and thumbnail generated successfully',
                videoPath: videoPath,
                thumbnailPath: thumbnailPath
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

module.exports = router;
