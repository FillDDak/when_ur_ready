var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// sequelize 모듈 가져오기, 데이터베이스 연결
var { Sequelize } = require('sequelize');

// 초기 연결 (데이터베이스 없이)
var sequelize = new Sequelize("", "root", "123456", {
  host: "localhost",
  dialect: "mysql" // 데이터베이스에 맞는 SQL문 연결
});

// MySQL2 root 비밀번호 변경 방법 (비번: 123456)
// MySQL2 Workbench에서 쿼리 생성 > 아래 코드 입력 > ctrl + enter
// ALTER USER 'root'@'localhost' IDENTIFIED BY '123456';

sequelize.query("CREATE DATABASE IF NOT EXISTS `when_ur_ready` CHARACTER SET utf8mb4;")
  .then(() => {
    // 데이터베이스 사용 설정 (재연결)
    sequelize = new Sequelize("when_ur_ready", "root", "123456", {
      host: "localhost",
      dialect: "mysql"
    });
    global.sequelize = sequelize; // 전역 변수 선언
    require("./model")(Sequelize, sequelize); // 모델 불러오기 및 데이터베이스 모델 정의
  })
  .catch(err => {
    console.error('데이터베이스 생성 오류:', err);
  });

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// 사용자 로그인 세션을 MySQL에 저장하여 세션 데이터를 영구적으로 유지
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const options = {
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: '123456',
  database: 'when_ur_ready'
};
const sessionStore = new MySQLStore(options);
app.use(session({
  key: 'session_id',
  secret: '!@#QWEASDZXC',
  store: sessionStore,
  resave: false,
  saveUninitialized: false
}));

app.use(express.static(path.join(__dirname, 'public')));

// 라우터 연결
app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// 서버 실행
app.listen(3001, () => {
  console.log('Server is running on port 3001');
});

module.exports = app;
