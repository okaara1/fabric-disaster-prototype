"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
// Contoller interface
const interface_controllers_1 = require("./interface.controllers");
// Models
const medical_record_model_1 = require("../models/medical-record.model");
class MedicalRecordController extends interface_controllers_1.RouteController {
    constructor() {
        super();
        this.router = express_1.Router();
        this.init();
    }
    getRoutes() {
        return this.router;
    }
    GetRecordById(req, res) {
        let recordId = req.params.id;
        res.send(`You asked for this record: ${recordId}!`);
    }
    PutRecord(req, res) {
        try {
            const medicalRecord = new medical_record_model_1.MedicalRecord(req.body);
            res.send(`Medical record: ${JSON.stringify(medicalRecord)}!`);
        }
        catch (error) {
            res.status(400).send({ message: error.message });
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
    init() {
        this.router
            .get("/:id", this.GetRecordById)
            .put("/", this.PutRecord);
    }
}
const medicalRecordController = new MedicalRecordController();
exports.medicalRecordRoutes = medicalRecordController.getRoutes();
