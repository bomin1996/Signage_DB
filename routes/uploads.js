const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Jimp = require('jimp'); // Jimp 라이브러리
const ffmpeg = require('fluent-ffmpeg');
const ffmpegInstaller = require('@ffmpeg-installer/ffmpeg');
const ffprobeInstaller = require('@ffprobe-installer/ffprobe');
const db = require('../sequelize');

// ffmpeg 설정
ffmpeg.setFfmpegPath(ffmpegInstaller.path);
ffmpeg.setFfprobePath(ffprobeInstaller.path);

// 디렉터리 생성 함수
function ensureDirectoryExistence(dirPath) {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
}

// Multer 설정
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        let uploadPath;
        if (file.mimetype.startsWith('image/')) {
            uploadPath = path.join(__dirname, '../public/uploads/images');
        } else if (file.mimetype.startsWith('video/')) {
            uploadPath = path.join(__dirname, '../public/uploads/videos');
        } else {
            return cb(new Error('Invalid file type'), false);
        }
        ensureDirectoryExistence(uploadPath); // 디렉터리 생성
        cb(null, uploadPath);
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

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|gif|mp4|mkv|avi/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Only image and video files are allowed!'));
        }
    },
    limits: { fileSize: 100 * 1024 * 1024 } // 100MB 제한
});

// 파일 업로드 및 처리
router.post('/upload', upload.fields([{ name: 'image', maxCount: 1 }, { name: 'video', maxCount: 1 }]), async (req, res) => {
    const files = req.files;

    if (!files.image && !files.video) {
        return res.status(400).json({ error: 'No files uploaded or invalid file type/size' });
    }

    const responses = {};

    if (files.image) {
        const imagePath = files.image[0].path;
        const thumbnailPath = `public/uploads/thumbnails/${path.basename(files.image[0].filename, path.extname(files.image[0].filename))}.png`;

        ensureDirectoryExistence(path.dirname(thumbnailPath)); // 썸네일 디렉터리 생성

        try {
            // 이미지 썸네일 생성
            const image = await Jimp.read(imagePath);
            await image.resize(200, 200).writeAsync(thumbnailPath);

            // 데이터베이스에 파일 정보 저장
            const content = await db.Contents.create({
                file_name: files.image[0].filename,
                file_type: files.image[0].mimetype,
                file_size: files.image[0].size,
                file_path: imagePath
            });

            responses.image = {
                message: 'Image uploaded and thumbnail generated successfully',
                imagePath: imagePath,
                thumbnailPath: thumbnailPath
            };

        } catch (err) {
            return res.status(500).json({ error: 'Error processing image', details: err.message });
        }
    }

    if (files.video) {
        const videoPath = files.video[0].path;
        const videoThumbnailPath = `public/uploads/thumbnails/${path.basename(files.video[0].filename, path.extname(files.video[0].filename))}.png`;

        ensureDirectoryExistence(path.dirname(videoThumbnailPath)); // 썸네일 디렉터리 생성

        // 동영상 썸네일 생성
        ffmpeg(videoPath)
            .on('end', async function () {
                console.log('Video screenshot taken');

                // 데이터베이스에 파일 정보 저장
                try {
                    const content = await db.Contents.create({
                        file_name: files.video[0].filename,
                        file_type: files.video[0].mimetype,
                        file_size: files.video[0].size,
                        file_path: videoPath
                    });

                    responses.video = {
                        message: 'Video uploaded and thumbnail generated successfully',
                        videoPath: videoPath,
                        thumbnailPath: videoThumbnailPath
                    };

                    if (!files.image) {
                        return res.status(200).json(responses);
                    } else {
                        res.status(200).json(responses);
                    }
                } catch (err) {
                    return res.status(500).json({ error: 'Database error', details: err.message });
                }

            })
            .on('error', function (err) {
                console.error(err);
                return res.status(500).json({ error: 'Error generating video thumbnail', details: err.message });
            })
            .screenshots({
                count: 1,
                folder: 'public/uploads/thumbnails',
                filename: path.basename(videoThumbnailPath),
                size: '320x240'
            });
    }

    if (files.image && !files.video) {
        return res.status(200).json(responses);
    }
});

module.exports = router;
