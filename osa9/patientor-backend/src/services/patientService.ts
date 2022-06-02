import patientData from "../../data/patients.json";
import { Patient, PatientEntry, NewPatientEntry } from "../types";
import { v4 as uuid } from "uuid";

const patients: Array<Patient> = patientData as Array<Patient>;

const getPatients = (): PatientEntry[] => {
  return patients.map(({ id, name, dateOfBirth, gender, occupation }) => ({
    id,
    name,
    dateOfBirth,
    gender,
    occupation,
  }));
};

const addPatient = (entry: NewPatientEntry): PatientEntry => {
  const newId: string = uuid();
  const newPatient = {
    id: newId,
    ...entry,
  };
  patients.push(newPatient);
  return newPatient;
};

export default { getPatients, addPatient };
