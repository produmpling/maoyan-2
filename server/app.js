const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const logger = require('morgan');
global.redis = require('redis');
const config = require('./config/index');
global.redisClient = redis.createClient({
    password: config.redis.password,
    host: config.redis.host,
    port: config.redis.port,
    prefix: config.redis.prefix,
});

const indexRouter = require('./routes/index');
const userRouter = require('./routes/user');
const loginRouter = require('./routes/login');
const bannerRouter = require('./routes/banner');
const uploadRouter = require('./routes/upload');
const administratorRouter = require('./routes/administrator');
const systemRouter = require('./routes/system');
const movieRouter = require('./routes/movie');
const theaterRouter = require('./routes/theater');
const favoriteRouter = require('./routes/favorite');
const orderRouter = require('./routes/order');
const timetableRouter = require('./routes/timetable');
const commentRouter = require('./routes/comment');
const cityRouter = require('./routes/city');
const actorRouter = require('./routes/actor');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(bodyParser.urlencoded({ limit: 1024 * 1024 * 1024, extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//设置跨域访问
app.all('*', function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'skey');
  res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS');
  res.header('X-Powered-By', ' 3.2.1');
  if (req.method.toLocaleLowerCase() === 'options'){
    res.status(204);
    return res.json({})
  }else {
    next();
  }
});
app.use('/', indexRouter);
app.use('/user', userRouter);
app.use('/login', loginRouter);
app.use('/banner', bannerRouter);
app.use('/upload', uploadRouter);
app.use('/administrator', administratorRouter);
app.use('/system', systemRouter);
app.use('/movie', movieRouter);
app.use('/theater', theaterRouter);
app.use('/favorite', favoriteRouter);
app.use('/order', orderRouter);
app.use('/timetable', timetableRouter);
app.use('/comment', commentRouter);
app.use('/city', cityRouter);
app.use('/actor', actorRouter);

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
