import { Router, Request, Response, NextFunction } from 'express';

// Contoller interface
import { RouteController } from './interface.controllers';

// Models
import { MedicalRecord } from '../models/medical-record.model';
import { HealthRecordQueries, HealthRecordInvokes } from "../blockchain";

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

  public async GetRecords(req: Request, res: Response) {

    try {
      const recordId = req.params.id;
      const records: MedicalRecord[] = await new HealthRecordQueries().queryAllRecords();
      res.json(records);

    } catch (error) {
      res.status(500).send(error);
    }
  }

  // public async GetRecordById(req: Request, res: Response) {
  //   let recordId = req.params.id;
  //   try {
  //     let record = await FabricDAO.queryRecordById(recordId);
  //     res.json(JSON.parse(record));
  //   } catch (err) {
  //     res.status(404).send();
  //   }
  // }


  public async GetRecordById(req: Request, res: Response) {
    let recordId = req.params.id;
    try {
      let record: MedicalRecord = await new HealthRecordQueries().queryRecordById(recordId);
      res.json(record);
    } catch (error) {
      res.status(404).send({ message: error.message });
    }
  }

  public async PutRecord(req: Request, res: Response) {
    try { 
      // let results = await FabricDAO.createRecord(req.body);
      const medicalRecord: MedicalRecord = new MedicalRecord(req.body);      

      const results = await new HealthRecordInvokes().createRecord(medicalRecord);
      console.log('Send transaction promise and event listener promise have completed');
      // check the results in the order the promises were added to the promise all list
      if (results && results[0] && results[0].status === 'SUCCESS') {
        console.log('Successfully sent transaction to the orderer.');
      } else {
        throw new Error('Failed to order the transaction.'); 
      }

      if (results && results[1] && results[1].event_status === 'VALID') {
        let message = 'Successfully committed the change to the ledger by the peer';
        console.log(message);
        res.json({ message });
      } else {
        throw new Error('Transaction failed to be committed to the ledger due to ::' + results[1].event_status);
      }
    } catch (err) {
      console.error(err);
      res.status(400).send({message: err});
    }
  }

  public async DeleteRecord(req: Request, res: Response) {
    try {
      // let results = await FabricDAO.createRecord(req.body);
      const records: string = req.body;

      const results = await new HealthRecordInvokes().deleteRecord(req.body.id);
      console.log('Send transaction promise and event listener promise have completed');
      // check the results in the order the promises were added to the promise all list
      if (results && results[0] && results[0].status === 'SUCCESS') {
        console.log('Successfully sent transaction to the orderer.');
      } else {
        throw new Error('Failed to order the transaction.');
      }

      if (results && results[1] && results[1].event_status === 'VALID') {
        let message = 'Successfully committed the change to the ledger by the peer';
        console.log(message);
        res.json({ message });
      } else {
        throw new Error('Transaction failed to be committed to the ledger due to ::' + results[1].event_status);
      }
    } catch (err) {
      console.error(err);
      res.status(400).send({ message: err });
    }
  }

  protected init() {
    this.router
      .get("/", this.GetRecords)
      .get("/:id", this.GetRecordById)
      .delete("/", this.DeleteRecord)
      .put("/", this.PutRecord);
  }
}

const medicalRecordController = new MedicalRecordController();
export const medicalRecordRoutes = medicalRecordController.getRoutes();