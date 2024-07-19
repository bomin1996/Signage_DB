const request = require('supertest');
const assert = require('assert');
const path = require('path');
const fs = require('fs');
const app = require('../app'); // Express 앱 불러오기
const db = require('../sequelize'); // 시퀄라이즈 인스턴스 불러오기

describe('Download API', function () {
    this.timeout(10000); // 테스트 타임아웃 설정 (필요시 조정)

    let uploadedFilePaths = [];
    let contentId = null;
    const originalFileName = 'test_image.jpg';

    // 테스트 전에 DB 초기화 및 파일 업로드
    before(async () => {
        await db.Contents.destroy({ where: {} });

        // 파일을 업로드하고 contentId를 가져옵니다.
        await new Promise((resolve, reject) => {
            request(app)
                .post('/contents/upload')
                .attach('image', path.resolve(__dirname, originalFileName))
                .expect(200)
                .end((err, res) => {
                    if (err) return reject(err);
                    uploadedFilePaths.push(res.body.filePath);
                    db.Contents.findOne({ where: { file_path: res.body.filePath } })
                        .then(content => {
                            contentId = content.content_id;
                            resolve();
                        })
                        .catch(reject);
                });
        });
    });

    // 파일 전체 다운로드 테스트
    it('파일을 전체 다운로드해야 합니다.', (done) => {
        request(app)
            .get(`/download/${contentId}`)
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                const downloadedFileName = res.headers['content-disposition'].split('filename=')[1].replace(/"/g, '');
                assert.strictEqual(downloadedFileName, path.basename(uploadedFilePaths[0]));
                done();
            });
    });

    // 파일 부분 범위 다운로드 테스트
    it('파일의 부분 범위를 다운로드해야 합니다.', (done) => {
        request(app)
            .get(`/download/${contentId}`)
            .set('Range', 'bytes=0-1024')
            .expect(206)
            .end((err, res) => {
                if (err) return done(err);
                const contentRange = res.headers['content-range'];
                const totalSize = fs.statSync(path.join(__dirname, `../public${uploadedFilePaths[0]}`)).size;
                assert.strictEqual(contentRange, `bytes 0-1024/${totalSize}`);
                done();
            });
    });

    // 존재하지 않는 파일 다운로드 시 오류 반환 테스트
    it('존재하지 않는 파일을 다운로드하려고 하면 오류를 반환해야 합니다.', (done) => {
        request(app)
            .get('/download/99999')
            .expect(404)
            .end((err, res) => {
                if (err) return done(err);
                assert.strictEqual(res.body.error, '파일을 찾을 수 없습니다.');
                done();
            });
    });

    // 잘못된 범위 요청 시 오류 반환 테스트
    it('잘못된 범위 요청 시 오류를 반환해야 합니다.', (done) => {
        request(app)
            .get(`/download/${contentId}`)
            .set('Range', 'bytes=1000000-2000000')
            .expect(416)
            .end((err, res) => {
                if (err) return done(err);
                const contentRange = res.headers['content-range'];
                const totalSize = fs.statSync(path.join(__dirname, `../public${uploadedFilePaths[0]}`)).size;
                assert.strictEqual(contentRange, `bytes */${totalSize}`);
                done();
            });
    });

    // 테스트 완료 후 파일 삭제 및 DB 정리
    after((done) => {
        const deletePromises = uploadedFilePaths.map(filePath => {
            return new Promise((resolve, reject) => {
                const fullPath = path.join(__dirname, `../public${filePath}`);
                fs.access(fullPath, fs.constants.F_OK, (err) => {
                    if (err) {
                        console.log(`File does not exist, skipping deletion: ${fullPath}`);
                        return resolve(); // 파일이 없으면 삭제를 스킵하고 성공으로 간주합니다.
                    }
                    fs.unlink(fullPath, (err) => {
                        if (err) {
                            console.log(`Failed to delete file: ${fullPath}`);
                            return reject(err);
                        }
                        console.log(`File deleted: ${fullPath}`);
                        resolve();
                    });
                });
            });
        });

        Promise.all(deletePromises)
            .then(() => db.Contents.destroy({ where: {} }))
            .then(() => done())
            .catch(done);
    });
});
