const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const db = require('./sequelize');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const authRouter = require('./routes/auth');
const uploadRouter = require('./routes/uploads');
const contentsRouter = require('./routes/contents'); // 콘텐츠 관리 라우트 추가
const devicesRouter = require('./routes/devices'); // 디바이스 관리 라우트 추가
const layoutsRouter = require('./routes/layouts'); // 레이아웃 관리 라우트 추가

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
app.use('/auth', authRouter);
app.use('/uploads', uploadRouter);
app.use('/contents', contentsRouter); // 콘텐츠 관리 라우트 사용
app.use('/devices', devicesRouter); // 디바이스 관리 라우트 사용
app.use('/layouts', layoutsRouter); // 레이아웃 관리 라우트 사용

// 에러 처리 미들웨어
app.use(function(err, req, res, next) {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!', details: err.message });
});

// 데이터베이스 초기화
db.sequelize.sync({ force: false }).then(() => {
    console.log('Database synchronized');
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

module.exports = app;
