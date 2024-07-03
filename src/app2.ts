import express from 'express';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import cors from 'cors';
import config from './config/inversify.config';
import 'reflect-metadata';
import authenticationRouter from './auth/routes/AuthRoutes2';

class App {
  public app: express.Application;

  constructor() {
    this.app = express();
    this.setMiddlewares();
    this.setRoutes();
    this.setErrorHandler();
  }

  private setMiddlewares() {
    this.app.use(helmet());
    this.app.use(compression());
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

    this.app.use(express.json());
  }

  private setRoutes() {
    this.app.use('/v1/api/auth', authenticationRouter);
  }
  // private setRoutes() {
  //   this.app.use('/v1/api/auth', (req, res) => res.send("hello, world!"));
  // }

  private setErrorHandler() {
    this.app.use((req, res, next) => {
      res.status(404).send('Not Found');
    });

    // this.app.use((err, req, res, next) => {
    //   res.locals.message = err.message;
    //   res.locals.error = req.app.get('env') === 'development' ? err : {};

    //   res.status(err.status || 500);
    //   res.render('error');
    // });
  }

  public start() {
    //const PORT = config.get("production.server.port") || 3000;
    const PORT = 8080;
    this.app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  }
}

export default App;
