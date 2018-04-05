/* Express Web Application - REST API Host */
import * as path from 'path';
import express from 'express';
import morgan from 'morgan';
import * as bodyParser from 'body-parser';

// App routes
import { 
  welcomeRoutes, 
  medicalRecordRoutes 
} from './controllers';


class App {

  public express: express.Application;

  constructor() {
    this.express = express();
    this
      .setMiddlewares()
      .setRoutes();
  }

  private setMiddlewares(): App {
    this.express.use(morgan('dev'));
    this.express.use(bodyParser.json());
    this.express.use(bodyParser.urlencoded({ extended: false }));
    return this;
  }

  private setRoutes(): App {
    let router = express.Router();
    this.express.use('/api/v1/welcome', welcomeRoutes);
    this.express.use('/api/v1/records', medicalRecordRoutes);
    return this;
  }

}

export default new App().express;