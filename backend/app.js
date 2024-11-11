var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// sequelize 모듈 가져오기, 데이터베이스 연결
var { Sequelize } = require('sequelize')
var sequelize = new Sequelize("when_ur_ready", "root", "!Aa5520634", {
  host: "localhost",
  dialect: "mysql" // 데이터베이스에 맞는 sql문 연결
})
global.sequelize = sequelize; // 전역 변수 선언
require("./model")(Sequelize, sequelize) // 모델 불러오기 및 데이터베이스 모델 정의

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

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

module.exports = app;
