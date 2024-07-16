const express = require('express');
const router = express.Router();
const db = require('../db');  // db 연결 모듈 가져오기
const { body, param, validationResult } = require('express-validator');

// GET home page.
router.get('/', function(req, res, next) {
    res.send('Express'); // 여기에 렌더링이나 응답 내용을 수정할 수 있습니다.
});

// GET databases
router.get('/databases', function(req, res, next) {
    db.query('SHOW DATABASES', (err, results) => {
        if (err) {
            console.error('Error fetching databases:', err);
            return next(err);
        }
        res.json(results);
    });
});

// GET tables in a specific database
router.get('/databases/:dbname/tables',
    param('dbname').notEmpty().withMessage('Database name is required'),
    function(req, res, next) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const dbname = req.params.dbname;
        db.query(`SHOW TABLES IN \`${dbname}\``, (err, results) => {
            if (err) {
                console.error('Error fetching tables:', err);
                return next(err);
            }
            res.json(results);
        });
    }
);

// GET data from a specific table
router.get('/databases/:dbname/tables/:tablename',
    [param('dbname').notEmpty().withMessage('Database name is required'),
        param('tablename').notEmpty().withMessage('Table name is required')],
    function(req, res, next) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const dbname = req.params.dbname;
        const tablename = req.params.tablename;
        db.query(`SELECT * FROM \`${dbname}\`.\`${tablename}\``, (err, results) => {
            if (err) {
                console.error('Error fetching table data:', err);
                return next(err);
            }
            res.json(results);
        });
    }
);

// 데이터 추가 (Create)
router.post('/databases/:dbname/tables/:tablename',
    [param('dbname').notEmpty().withMessage('Database name is required'),
        param('tablename').notEmpty().withMessage('Table name is required')],
    function(req, res, next) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const dbname = req.params.dbname;
        const tablename = req.params.tablename;
        const data = req.body; // 요청 본문에서 데이터를 가져옴

        if (!data || Object.keys(data).length === 0) {
            return res.status(400).json({ error: 'Data is required' });
        }

        const fields = Object.keys(data).map(field => `\`${field}\``).join(', ');
        const values = Object.values(data).map(value => `'${value}'`).join(', ');

        const query = `INSERT INTO \`${dbname}\`.\`${tablename}\` (${fields}) VALUES (${values})`;
        db.query(query, (err, results) => {
            if (err) {
                console.error('Error inserting data:', err);
                return next(err);
            }
            res.status(201).json({ message: 'Data inserted successfully', id: results.insertId });
        });
    }
);

// 데이터 수정 (Update)
router.put('/databases/:dbname/tables/:tablename/:id',
    [param('dbname').notEmpty().withMessage('Database name is required'),
        param('tablename').notEmpty().withMessage('Table name is required'),
        param('id').isInt().withMessage('ID must be an integer')],
    function(req, res, next) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const dbname = req.params.dbname;
        const tablename = req.params.tablename;
        const id = req.params.id;
        const data = req.body; // 요청 본문에서 데이터를 가져옴

        if (!data || Object.keys(data).length === 0) {
            return res.status(400).json({ error: 'Data is required' });
        }

        const updates = Object.keys(data).map(field => `\`${field}\`='${data[field]}'`).join(', ');

        const query = `UPDATE \`${dbname}\`.\`${tablename}\` SET ${updates} WHERE id=${id}`;
        db.query(query, (err, results) => {
            if (err) {
                console.error('Error updating data:', err);
                return next(err);
            }
            res.json({ message: 'Data updated successfully', affectedRows: results.affectedRows });
        });
    }
);

// 데이터 삭제 (Delete)
router.delete('/databases/:dbname/tables/:tablename/:id',
    [param('dbname').notEmpty().withMessage('Database name is required'),
        param('tablename').notEmpty().withMessage('Table name is required'),
        param('id').isInt().withMessage('ID must be an integer')],
    function(req, res, next) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const dbname = req.params.dbname;
        const tablename = req.params.tablename;
        const id = req.params.id;

        const query = `DELETE FROM \`${dbname}\`.\`${tablename}\` WHERE id=${id}`;
        db.query(query, (err, results) => {
            if (err) {
                console.error('Error deleting data:', err);
                return next(err);
            }
            res.json({ message: 'Data deleted successfully', affectedRows: results.affectedRows });
        });
    }
);

module.exports = router;
