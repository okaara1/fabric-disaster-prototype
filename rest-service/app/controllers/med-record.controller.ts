import { Router, Request, Response, NextFunction } from 'express';

// Contoller interface
import { RouteController } from './interface.controllers';

// Models
import { MedicalRecord } from '../models/medical-record.model';

class MedicalRecordController extends RouteController {

  public router: Router;

  constructor() {
    super();
    this.router = Router();
    this.init();
  }

  public getRoutes(): Router {
    return this.router;
  }

  public GetRecordById(req: Request, res: Response) {
    let recordId = req.params.id;
    res.send(`You asked for this record: ${recordId}!`);
  }

  public PutRecord(req: Request, res: Response) {
    try {
      const medicalRecord: MedicalRecord = new MedicalRecord(req.body);      
      res.send(`Medical record: ${JSON.stringify(medicalRecord)}!`);
    } catch (error) {
      res.status(400).send({message: error.message});
    }
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
      .get("/:id", this.GetRecordById)
      .put("/", this.PutRecord);
  }
}

const medicalRecordController = new MedicalRecordController();
export const medicalRecordRoutes = medicalRecordController.getRoutes();