/* Express Web Application - REST API Host */
import * as path from 'path';
import express from 'express';
import morgan from 'morgan';
import * as bodyParser from 'body-parser';
import mongoose from 'mongoose';
// App routes
import { 
  welcomeRoutes, 
  medicalRecordRoutes 
} from './controllers';


class App {

  public express: express.Application;
  private MONGO_HOST: string;
  private MONGO_PORT: number;

  constructor() {
    this.express = express();
    this.MONGO_HOST = process.env.MONGO_HOST || "localhost";
    this.MONGO_PORT = Number(process.env.MONGO_PORT) || 27017;
    
    this
      .setDBConnection()
      .setMiddlewares()
      .setRoutes();
  }

  private setDBConnection(): App {
    try {
      mongoose.createConnection(this.getDBUrl());
    } catch (error) {
      console.log("Unable to connect to the mongo instance");
    }
    return this;
  }

  private getDBUrl() {
    return 'mongodb://' + this.MONGO_HOST + ':' + this.MONGO_PORT + '/dev';
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