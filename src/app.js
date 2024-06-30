const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const helmet = require('helmet');
const compression = require('compression');
require('dotenv').config();
const { createProxyMiddleware } = require('http-proxy-middleware');

const authenticationRouter = require('./auth/routes/AuthRoutes');
const { verifyTokenWithHS256, verifyTokenWithRS256 } = require('./auth/middlewares/VerifyToken');
const Role = require('./auth/utils/Role');

var app = express();

// init middlewares
//app.use(logger('dev'));
app.use(logger('combined'));
app.use(helmet());
app.use(compression());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
const cors = require('cors');

app.use(cors({
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
}));


// init db
require('./config/database/MongoDB');

// init routes
app.use('/v1/api/auth', authenticationRouter);
// app.use('/api/shop', verifyTokenWithHS256([Role.SHOP]), createProxyMiddleware({
//   target: 'http://api.restful-api.dev',
//   changeOrigin: true,
//   pathRewrite: { '^/api/shop': '/objects' }
// }));
app.use('/api/private',createProxyMiddleware({
  target: 'https://api.restful-api.dev',
  changeOrigin: true,
  pathRewrite: {
    '^/api/private': '/objects',
  },
  logLevel: 'debug',
  onError(err, req, res) {
    console.error('Proxy Error:', err);
    res.status(500).send('Proxy Error');
  },
}));

const rewriteFn = function (path, req) {
  return path.replace('/api/private', '/objects');
};

// app.use(createProxyMiddleware({
//   target: 'https://api.restful-api.dev',
//   changeOrigin: true,
//   pathRewrite: {
//     [`^/api/private`]: '/objects',
//   },
// }));

// app.use('/api/private', verifyTokenWithHS256([Role.SHOP, Role.USER]), createProxyMiddleware({
//   target: 'https://api.restful-api.dev/objects',
//   changeOrigin: true,
//   //pathRewrite: { '^/api/private': '/objects' },
//   // onProxyReq(proxyReq, req, res) {
//   //   console.log('Proxying request to: ', proxyReq.href);
//   // },
//   // onError(err, req, res) {
//   //   console.error('Proxy error: ', err);
//   //   res.status(500).send('Proxy error');
//   // }
// }));

// error handler

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
