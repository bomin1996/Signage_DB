const request = require('supertest');
const assert = require('assert');
const path = require('path');
const fs = require('fs');
const app = require('../app'); // Express 앱 불러오기
const db = require('../sequelize'); // 시퀄라이즈 인스턴스 불러오기

describe('Contents API', function () {
    this.timeout(10000); // 테스트 타임아웃 설정 (필요시 조정)

    let uploadedFilePath = '';
    let contentId = null;

    // 업로드 테스트
    it('파일을 업로드하고 메타데이터를 데이터베이스에 저장해야 합니다.', (done) => {
        request(app)
            .post('/contents/upload')
            .attach('image', path.resolve(__dirname, 'test_image.jpg'))
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                assert.strictEqual(res.body.message, 'File uploaded successfully');
                assert.ok(res.body.filePath);
                uploadedFilePath = res.body.filePath;

                // DB에 파일 메타데이터 저장 확인
                db.Contents.findOne({ where: { file_path: uploadedFilePath } })
                    .then(content => {
                        assert.ok(content);
                        contentId = content.content_id;
                        done();
                    })
                    .catch(done);
            });
    });

    // 파일 이름 중복 처리 테스트
    it('파일 이름 충돌 시 파일 이름을 변경하여 처리해야 합니다.', (done) => {
        request(app)
            .post('/contents/upload')
            .attach('image', path.resolve(__dirname, 'test_image.jpg'))
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                assert.strictEqual(res.body.message, 'File uploaded successfully');
                assert.ok(res.body.filePath);
                assert.notStrictEqual(res.body.filePath, uploadedFilePath); // 파일 이름이 변경되었는지 확인
                done();
            });
    });

    // 파일 업로드 실패 테스트 (파일 없음)
    it('파일이 업로드되지 않은 경우 오류를 반환해야 합니다.', (done) => {
        request(app)
            .post('/contents/upload')
            .expect(400)
            .end((err, res) => {
                if (err) return done(err);
                assert.strictEqual(res.body.error, 'No file uploaded');
                done();
            });
    });

    // 페이지네이션 테스트
    it('페이지네이션을 사용하여 업로드된 콘텐츠 목록을 가져와야 합니다.', (done) => {
        request(app)
            .get('/contents?page=1&pageSize=10')
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                assert.ok(Array.isArray(res.body.contents));
                assert.ok(res.body.contents.length > 0);
                assert.strictEqual(res.body.currentPage, 1);
                assert.strictEqual(res.body.totalPages, 1);
                done();
            });
    });

    // 페이지네이션 테스트 (내용 없음)
    it('콘텐츠가 없는 경우 페이지네이션으로 빈 콘텐츠 목록을 반환해야 합니다.', (done) => {
        db.Contents.destroy({ where: {} }).then(() => {
            request(app)
                .get('/contents?page=1&pageSize=10')
                .expect(200)
                .end((err, res) => {
                    if (err) return done(err);
                    assert.ok(Array.isArray(res.body.contents));
                    assert.strictEqual(res.body.contents.length, 0);
                    assert.strictEqual(res.body.currentPage, 1);
                    assert.strictEqual(res.body.totalPages, 0);
                    done();
                });
        });
    });

    // 파일 삭제 테스트
    it('특정 콘텐츠를 삭제해야 합니다.', (done) => {
        // 먼저 파일을 업로드합니다.
        request(app)
            .post('/contents/upload')
            .attach('image', path.resolve(__dirname, 'test_image.jpg'))
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                uploadedFilePath = res.body.filePath;

                // 업로드된 파일을 다시 DB에서 찾아 contentId를 가져옵니다.
                db.Contents.findOne({ where: { file_path: uploadedFilePath } })
                    .then(content => {
                        assert.ok(content);
                        contentId = content.content_id;

                        // 이제 파일을 삭제합니다.
                        request(app)
                            .delete(`/contents/${contentId}`)
                            .expect(200)
                            .end((err, res) => {
                                if (err) return done(err);
                                assert.strictEqual(res.body.message, 'File deleted successfully');

                                // 파일이 실제로 삭제되었는지 확인
                                fs.access(path.join(__dirname, `../public${uploadedFilePath}`), fs.constants.F_OK, (err) => {
                                    assert.ok(err); // 파일이 존재하지 않아야 함
                                    done();
                                });
                            });
                    })
                    .catch(done);
            });
    });

    // 파일 삭제 테스트 (존재하지 않는 파일)
    it('존재하지 않는 콘텐츠를 삭제하려고 하면 오류를 반환해야 합니다.', (done) => {
        request(app)
            .delete(`/contents/99999`) // 존재하지 않는 ID로 테스트
            .expect(404)
            .end((err, res) => {
                if (err) return done(err);
                assert.strictEqual(res.body.error, 'File not found');
                done();
            });
    });

    // 파일 삭제 실패 테스트 (파일 삭제 오류)
    it('파일 시스템 오류가 발생하면 적절한 오류 메시지를 반환해야 합니다.', (done) => {
        // 파일 시스템의 fs.unlink 메서드를 모킹합니다.
        const originalUnlink = fs.unlink;
        fs.unlink = (filePath, callback) => {
            callback(new Error('File system error'));
        };

        // 테스트가 끝난 후 원래의 fs.unlink를 복원합니다.
        after(() => {
            fs.unlink = originalUnlink;
        });

        // 먼저 파일을 업로드합니다.
        request(app)
            .post('/contents/upload')
            .attach('image', path.resolve(__dirname, 'test_image.jpg'))
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                uploadedFilePath = res.body.filePath;

                // 업로드된 파일을 다시 DB에서 찾아 contentId를 가져옵니다.
                db.Contents.findOne({ where: { file_path: uploadedFilePath } })
                    .then(content => {
                        assert.ok(content);
                        contentId = content.content_id;

                        // 이제 파일을 삭제합니다.
                        request(app)
                            .delete(`/contents/${contentId}`)
                            .expect(500)
                            .end((err, res) => {
                                if (err) return done(err);
                                assert.strictEqual(res.body.error, 'File deletion error');
                                done();
                            });
                    })
                    .catch(done);
            });
    });

    // 파일 다운로드 테스트
    it('특정 콘텐츠를 다운로드해야 합니다.', (done) => {
        // 먼저 파일을 업로드합니다.
        request(app)
            .post('/contents/upload')
            .attach('image', path.resolve(__dirname, 'test_image.jpg'))
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                uploadedFilePath = res.body.filePath;

                // 업로드된 파일을 다시 DB에서 찾아 contentId를 가져옵니다.
                db.Contents.findOne({ where: { file_path: uploadedFilePath } })
                    .then(content => {
                        assert.ok(content);
                        contentId = content.content_id;

                        // 이제 다운로드를 테스트합니다.
                        request(app)
                            .get(`/contents/download/${contentId}`)
                            .expect(200)
                            .end((err, res) => {
                                if (err) return done(err);
                                assert.strictEqual(res.headers['content-disposition'], `attachment; filename="${content.file_name}"`);
                                done();
                            });
                    })
                    .catch(done);
            });
    });

    // 파일 다운로드 테스트 (존재하지 않는 파일)
    it('존재하지 않는 콘텐츠를 다운로드하려고 하면 오류를 반환해야 합니다.', (done) => {
        request(app)
            .get('/contents/download/99999') // 존재하지 않는 ID로 테스트
            .expect(404)
            .end((err, res) => {
                if (err) return done(err);
                assert.strictEqual(res.body.error, 'File not found');
                done();
            });
    });

    // 콘텐츠 검색 테스트
    it('특정 키워드로 콘텐츠를 검색해야 합니다.', (done) => {
        request(app)
            .get('/contents/search?keyword=test')
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                assert.ok(Array.isArray(res.body));
                done();
            });
    });

    // 콘텐츠 검색 테스트 (결과 없음)
    it('일치하는 키워드가 없을 때 빈 결과를 반환해야 합니다.', (done) => {
        request(app)
            .get('/contents/search?keyword=nonexistentkeyword')
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                assert.ok(Array.isArray(res.body));
                assert.strictEqual(res.body.length, 0);
                done();
            });
    });


});
