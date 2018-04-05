
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

    // public UpdatePhotoLocation(req: Request, res: Response) {

    //     var doc: PhotoLocationDocument = <PhotoLocationDocument>req.body;
    //     var data: LocationData = new LocationData();

    //     data.UpdateLocationAsync(doc).then(requestResult => {
    //         res.status(200).send(requestResult);
    //     }).catch(e => {
    //         res.status(404).send({
    //             message: e.message,
    //             status: 404
    //         });
    //     });

    // }

    // public DeletePhotoLocation(req: Request, res: Response) {

    //     let query: string = req.params.id;
    //     var data: LocationData = new LocationData();

    //     data.DeletePhotoLocationAsync(query).then(requestResult => {
    //         res.status(204).send();
    //     }).catch(e => {
    //         res.status(404).send({
    //             message: e.message,
    //             status: 404
    //         });
    //     });

    // };

    protected init() {
        this.router
            .get("/", this.GetWelcome)
            .get("/:id", this.GetWelcomeName);
    }
}

const welcomeController = new WelcomeController();
export const welcomeRoutes = welcomeController.getRoutes();