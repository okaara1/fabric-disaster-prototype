
import { Router, Request, Response, NextFunction } from 'express';
import { RouteController } from './interface.controllers';

class WelcomeController extends RouteController {

    public router: Router;

    constructor() {
        super();
        this.router = Router();
        this.init();
    }

    public getRoutes(): Router {
        return this.router;
    }

    public GetWelcome(req: Request, res: Response): void {
        res.status(200).send(`Welcome All!`);
    }

    public GetWelcomeName(req: Request, res: Response): void {
        res.status(200).send(`Welcome ${req.params['id']}`);
    }
    
    protected init() {
        this.router
            .get("/", this.GetWelcome)
            .get("/:id", this.GetWelcomeName);
    }
}

const welcomeController = new WelcomeController();
export const welcomeRoutes = welcomeController.getRoutes();