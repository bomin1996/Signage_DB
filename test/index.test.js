const request = require('supertest');
const assert = require('assert');
const app = require('../app'); // Express 앱 불러오기

describe('Databases API', () => {
    before((done) => {
        // 데이터베이스와 테이블 설정
        const db = require('../db');
        db.query('CREATE DATABASE IF NOT EXISTS testdb', (err) => {
            if (err) return done(err);
            db.query(`USE testdb`, (err) => {
                if (err) return done(err);
                db.query(`CREATE TABLE IF NOT EXISTS testtable (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255) NOT NULL, age INT NOT NULL)`, (err) => {
                    if (err) return done(err);
                    done();
                });
            });
        });
    });


    it('should get the list of databases', (done) => {
        request(app)
            .get('/databases')
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                assert.ok(res.body.length > 0);
                done();
            });
    });

    it('should get the list of tables in a specific database', (done) => {
        request(app)
            .get('/databases/testdb/tables')
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                assert.ok(res.body.length > 0);
                done();
            });
    });

    it('should get the data from a specific table', (done) => {
        request(app)
            .get('/databases/testdb/tables/testtable')
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                assert.ok(res.body.length >= 0);
                done();
            });
    });

    it('should create a new data entry in a specific table', (done) => {
        const newData = { name: 'John', age: 30 };
        request(app)
            .post('/databases/testdb/tables/testtable')
            .send(newData)
            .expect(201)
            .end((err, res) => {
                if (err) return done(err);
                assert.strictEqual(res.body.message, 'Data inserted successfully');
                done();
            });
    });

    it('should update a data entry in a specific table', (done) => {
        const updatedData = { name: 'John Updated', age: 35 };
        request(app)
            .put('/databases/testdb/tables/testtable/1')
            .send(updatedData)
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                assert.strictEqual(res.body.message, 'Data updated successfully');
                done();
            });
    });

    it('should delete a data entry in a specific table', (done) => {
        request(app)
            .delete('/databases/testdb/tables/testtable/1')
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                assert.strictEqual(res.body.message, 'Data deleted successfully');
                done();
            });
    });
});
