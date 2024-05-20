var express = require('express');
var router = express.Router();
var db = require('../db');  // db 연결 모듈 가져오기

// GET home page.
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// GET databases
router.get('/databases', function(req, res, next) {
  db.query('SHOW DATABASES', (err, results) => {
    if (err) {
      return next(err);
    }
    res.json(results);
  });
});

module.exports = router;
