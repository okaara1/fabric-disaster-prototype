"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Gender;
(function (Gender) {
    Gender["Male"] = "m";
    Gender["Female"] = "f";
})(Gender = exports.Gender || (exports.Gender = {}));
const medicalProto = Object.seal({
    _id: "...",
    name: "...",
    gender: 'm',
    lastname: "...",
    address: "...",
    birth: "...",
    careGivers: [{}],
    contactPersons: [{}],
    clinicalInfo: [{}],
    places: [{}],
});
class MedicalRecord {
    constructor(obj) {
        this.name = obj.name;
        this.gender = obj.gender;
        this.lastname = obj.lastname;
        //tslint:disable-next-line:forin
        for (const key in obj) {
            if (medicalProto.hasOwnProperty(key)) {
                this[key] = obj[key];
            }
        }
        Object.keys(this).map((key) => {
            if (!this[key])
                throw new Error(`Key '${key}' is missing!`);
        });
    }
}
exports.MedicalRecord = MedicalRecord;
