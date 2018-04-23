export enum Gender {
  Male = 'male',
  Female = 'female'
}

export interface CareGiver {
  _id?: string;
  name: string; 
  // add other fields...
}

export interface Treatment {
  _id?: string; 
  info: string;
  prescriber: CareGiver;
}

export interface Place {
  adress: string;
  name: string;
}

export interface Person {
  _id?: string; 
  name: string; 
  lastname: string;
}

export interface Diagnosis {
  _id?: string; 
  info: string; 
  doctor: CareGiver;
  mediaFiles: string[]; // important
}

export interface ClinicalInfo {
  diagnosis: Diagnosis | string;
  treatments: Treatment[] | string[];
}

export interface MedicalRecordInterface {
  _id?: string;
  name: string;
  gender: Gender;
  lastname: string;
  address?: string;
  birth?: string;
  careGivers?: CareGiver[];
  contactPersons?: Person[];
  clinicalInfo?: ClinicalInfo[];
  places?: Place[];
}

const medicalProto = Object.seal(<MedicalRecordInterface> {
  _id: "...",
  name: "...",
  gender: 'male',
  lastname: "...",
  address: "...",
  birth: "...",
  careGivers: [<CareGiver>{}],
  contactPerson: <Person>{},
  clinicalInfo: [<ClinicalInfo>{}],
  places: [<Place>{}],
});


export class MedicalRecord {
  name: string; 
  gender: Gender; 
  lastname: string;
  _id?: string;
  address?: string;
  birth?: string;
  careGivers?: CareGiver[]; 
  contactPerson?: Person;
  clinicalInfo?: ClinicalInfo[];
  places?: Place[];

  constructor(obj: { name: string, gender: Gender, lastname: string }) {

    this.name = obj.name;
    this.gender = obj.gender;
    this.lastname = obj.lastname;
    
    //tslint:disable-next-line:forin
    for (const key in obj) {
      if(medicalProto.hasOwnProperty(key)) {
        this[key] = obj[key];
      }
    }

    Object.keys(this).map((key) => {
      if (!this[key]) throw new Error(`Key '${key}' is missing!`); 
    });
  }
}