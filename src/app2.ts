import 'reflect-metadata';

import express, { Request, Response, NextFunction } from 'express';
import { inject, injectable } from 'inversify';
import createError from 'http-errors';
import { createProxyMiddleware } from 'http-proxy-middleware';
import path from 'path';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import helmet from 'helmet';
import compression from 'compression';
import cors from 'cors';
import config from 'config';
import * as dotenv from "dotenv";
dotenv.config();

import commonRouter from './config/CommonRoutes';
import verifyAuthToken from './auth/middlewares/Verify2Token';
import Role from './utils/Role2';

class App {
  public app: express.Application;

  constructor() {
    this.app = express();
    this.setMiddlewares();
    this.setRoutes();
    this.setGateway();
    this.setErrorHandler();
  }

  private setMiddlewares() {
    this.app.use(helmet());
    this.app.use(compression());
    //this.app.use(morgan('dev'));
    this.app.use(morgan('combined'));

    this.app.use(express.urlencoded({ extended: false }));
    this.app.use(cookieParser());
    this.app.use(express.static('public'));

    this.app.use(cors({
      origin: '*',
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      credentials: true,
    }));
    this.app.disable('x-powered-by');

    this.app.use((req, res, next) => {
      // Check if the request URL starts with /v1/api/auth or any other non-proxy routes
      if (req.url.startsWith('/v1/api/auth')) {
        express.json()(req, res, next);
      } else {
        next();
      }
    });
  }

  private setRoutes() {
    this.app.use(commonRouter);
  }

  // gateway
  private setGateway() {
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
        pathRewrite: (path: string, req: Request) => {
          return req.originalUrl;
        }
      };

      // Apply proxy middleware for each route
      this.app.use(pathPrefix, verifyAuthToken(requiredRoles), createProxyMiddleware(proxyOptions));
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

  private setErrorHandler() {
    // catch 404 and forward to error handler
    this.app.use((req: Request, res: Response, next: NextFunction) => {
      res.status(404).send('Not Found');
      //next(createError(404));
    });

    // error handler
    this.app.use((err: any, req: Request, res: Response, next: NextFunction) => {
      res.locals.message = err.message;
      res.locals.error = req.app.get('env') === 'development' ? err : {};

      res.status(err.status || 500);
      res.render('error');
    });
  }

  public start() {
    console.log('NODE_ENV:', process.env.NODE_ENV);
    const PORT = config.get(`${process.env.NODE_ENV}.server.port`) || 3000;
    //const PORT = 8080;
    this.app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  }
}

export default App;
