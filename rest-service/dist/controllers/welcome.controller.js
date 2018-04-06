"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const interface_controllers_1 = require("./interface.controllers");
class WelcomeController extends interface_controllers_1.RouteController {
    constructor() {
        super();
        this.router = express_1.Router();
        this.init();
    }
    getRoutes() {
        return this.router;
    }
    GetWelcome(req, res) {
        res.status(200).send(`Welcome All!`);
    }
    GetWelcomeName(req, res) {
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
    init() {
        this.router
            .get("/", this.GetWelcome)
            .get("/:id", this.GetWelcomeName);
    }
}
const welcomeController = new WelcomeController();
exports.welcomeRoutes = welcomeController.getRoutes();
