const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const db = require('./db');  // 데이터베이스 연결 추가

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// 연결 테스트용 간단한 쿼리
db.query('SELECT 1 + 1 AS solution', (err, results, fields) => {
    if (err) throw err;
    console.log('The solution is: ', results[0].solution);
});

module.exports = app;
