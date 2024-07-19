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
const devicesRouter = require('./routes/devices');
const layoutsRouter = require('./routes/layouts');
const schedulesRouter = require('./routes/schedules'); // 스케줄 관리 라우트 추가
const groupsRouter = require('./routes/groups'); // 그룹 관리 라우트 추가
const logsRouter = require('./routes/logs'); // 로그 관리 라우트 추가
const notificationsRouter = require('./routes/notifications'); // 알림 관리 라우트 추가
const videosRouter = require('./routes/videos'); // 동영상 업로드 라우트 추가
const healthRouter = require('./routes/health'); // Health Check 라우트 추가
const downloadRouter = require('./routes/download');

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
app.use('/devices', devicesRouter);
app.use('/layouts', layoutsRouter);
app.use('/schedules', schedulesRouter); // 스케줄 관리 라우트 사용
app.use('/groups', groupsRouter); // 그룹 관리 라우트 사용
app.use('/logs', logsRouter); // 로그 관리 라우트 사용
app.use('/notifications', notificationsRouter); // 알림 관리 라우트 사용
app.use('/videos', videosRouter); // 동영상 업로드 라우트 사용
app.use('/health', healthRouter); // Health Check 라우트 사용
app.use('/download', downloadRouter);

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
