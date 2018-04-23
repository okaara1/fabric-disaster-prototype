
import { Router, Request, Response, NextFunction } from 'express';
import { RouteController } from './interface.controllers';

class BaseController extends RouteController {

  public router: Router;

  constructor() {
    super();
    this.router = Router();
    this.init();
  }

  public getRoutes(): Router {
    return this.router;
  }

  public GetVersion(req: Request, res: Response): void {
    res.json({version: '1.0'});
  }

  public GetBase(req: Request, res: Response): void {
    res.status(200).send('<h1>Hyperledger in Disaster</h1><p>Project by Okan A. and Filippo B.</p>');
  }

  protected init() {
    this.router
      .get("/", this.GetBase)
      .get("/api", this.GetVersion);
  }
}

const baseController = new BaseController();
export const baseRoutes = baseController.getRoutes();