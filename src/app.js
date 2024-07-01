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
app.use(logger('combined')); // Log HTTP requests
app.use(helmet()); // Add security headers
app.use(compression());

// app.use(express.json()); // conflict with createProxyMiddleware
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
const cors = require('cors');

// app.use(cors({
//   origin: '*',
//   methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
//   credentials: true,
// }));
app.use(cors()); // Enable CORS
app.disable("x-powered-by"); // Hide Express server information

// init db
require('./config/database/MongoDB');

// init routes
app.use('/v1/api/auth', authenticationRouter);
// app.use('/api/shop', verifyTokenWithHS256([Role.SHOP]), createProxyMiddleware({
//   target: 'http://api.restful-api.dev',
//   changeOrigin: true,
//   pathRewrite: { '^/api/shop': '/objects' }
// }));

// =================================================================
// Define rate limit constants
const rateLimit = 20; // Max requests per minute
const interval = 60 * 1000; // Time window in milliseconds (1 minute)

// Object to store request counts for each IP address
const requestCounts = {};

// Reset request count for each IP address every 'interval' milliseconds
setInterval(() => {
  Object.keys(requestCounts).forEach((ip) => {
    requestCounts[ip] = 0; // Reset request count for each IP address
  });
}, interval);

// Middleware function for rate limiting and timeout handling
function rateLimitAndTimeout(req, res, next) {
  const ip = req.ip; // Get client IP address

  // Update request count for the current IP
  requestCounts[ip] = (requestCounts[ip] || 0) + 1;

  // Check if request count exceeds the rate limit
  if (requestCounts[ip] > rateLimit) {
    // Respond with a 429 Too Many Requests status code
    return res.status(429).json({
      code: 429,
      status: "Error",
      message: "Rate limit exceeded.",
      data: null,
    });
  }

  // Set timeout for each request (example: 10 seconds)
  req.setTimeout(15000, () => {
    // Handle timeout error
    res.status(504).json({
      code: 504,
      status: "Error",
      message: "Gateway timeout.",
      data: null,
    });
    req.abort(); // Abort the request
  });

  next(); // Continue to the next middleware
}

// Apply the rate limit and timeout middleware to the proxy
//app.use(rateLimitAndTimeout);
const services = [
  {
    route: "/objects1",
    target: "http://get.geojs.io/v1/ip/country.json?ip=8.8.8.8",
  },
  {
    route: "/objects",
    target: "http://api.restful-api.dev/objects"
  },
  // Add more services as needed
];
services.forEach(({ route, target }) => {
  // Proxy options
  const proxyOptions = {
    target,
    changeOrigin: true,
    pathRewrite: {
      [`^${route}`]: ""
    },
    pathRewrite: (path, req) => {
      // Remove trailing slash
      return path.replace(/\/$/, '');
    }
  };

  // Apply rate limiting and timeout middleware before proxying
  app.use(route, createProxyMiddleware(proxyOptions));
});


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
