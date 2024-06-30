const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const helmet = require('helmet');
const compression = require('compression');
require('dotenv').config();
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');
const config = require("config");

const authenticationRouter = require('./auth/routes/AuthRoutes');
const { verifyTokenWithHS256, verifyTokenWithRS256 } = require('./auth/middlewares/VerifyToken');
const Role = require('./utils/Role');

class App {
  constructor() {
    this.app = express();
    this.connectDB();
    this.setMiddlewares();
    this.setRoutes();
    this.setGateway();
    this.setErrorHandler();
  }

  connectDB() {
    require('./config/database/MongoDB');
  }

  setMiddlewares() {
    //app.use(logger('dev'));
    this.app.use(helmet()); // Add security headers
    this.app.use(compression());
    this.app.use(logger('combined')); // Log HTTP requests

    this.app.use(express.urlencoded({ extended: false }));
    this.app.use(cookieParser());
    this.app.use(express.static(path.join(__dirname, 'public')));

    this.app.use(cors({
      origin: '*',
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      credentials: true,
    }));
    this.app.disable("x-powered-by"); // Hide Express server information

    // Apply express.json() middleware conditionally
    this.app.use((req, res, next) => {
      // Check if the request URL starts with /v1/api/auth or any other non-proxy routes
      if (req.url.startsWith('/v1/api/auth')) {
        express.json()(req, res, next);
      } else {
        next();
      }
    });
  }

  setRoutes() {
    this.app.use('/v1/api/auth', authenticationRouter);
  }

  setGateway() {
    // Define the proxy services
    const services = [
      {
        pathPrefix: "/objects",
        target: "https://api.restful-api.dev",
        requiredRoles: [Role.SHOP, Role.USER]
      },
      {
        pathPrefix: "/api",
        target: "http://dog.ceo",
        requiredRoles: [Role.SHOP]
      }
    ];

    // Set up proxy middleware for each microservice
    services.forEach(({ pathPrefix, target, requiredRoles }) => {
      // Proxy options
      const proxyOptions = {
        target,
        changeOrigin: true,
        pathRewrite: (path, req) => {
          return req.originalUrl;
        }
      };

      // Apply proxy middleware for each route
      this.app.use(pathPrefix, verifyTokenWithHS256(requiredRoles), createProxyMiddleware(proxyOptions));
    });

    // Handler for route-not-found
    this.app.use((_req, res) => {
      res.status(404).json({
        code: 404,
        status: "Error",
        message: "Route not found.",
        data: null,
      });
    });
  }

  setErrorHandler() {
    // catch 404 and forward to error handler
    this.app.use(function (req, res, next) {
      next(createError(404));
    });

    // error handler
    this.app.use(function (err, req, res, next) {
      // set locals, only providing error in development
      res.locals.message = err.message;
      res.locals.error = req.app.get('env') === 'development' ? err : {};

      // render the error page
      res.status(err.status || 500);
      res.render('error');
    });
  }

  start() {
    const PORT = config.get("production.server.port");
    const server = this.app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
    process.on("SIGINT", () => {
      server.close(() => {
        console.log("Server closed");
        process.exit(0);
      });
    });
  }
}

module.exports = App;
