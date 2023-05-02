const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');

var indexRouter = require('./routes/index');
var loginRouter = require('./routes/login');
var emailAuthRouter = require('./routes/emailAuth');
var registerRouter = require('./routes/register');
var userRouter = require('./routes/user');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//app.use(bodyParser.json({limit:10000000}));
app.use(bodyParser.json({ limit: '50mb' }));

app.use(cors({
  origin: true,
  credentials: true
}));

app.use('/', indexRouter);
app.use('/login', loginRouter);
app.use('/emailAuth', emailAuthRouter);
app.use('/register',registerRouter);
app.use('/user',userRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
