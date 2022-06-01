import express from "express";
import patientService from "../services/patientService";
import { NewPatientEntry } from "../types";
import toNewPatientEntry from "../utils";

const router = express.Router();

router.get("/", (_req, res) => {
  res.send(patientService.getPatients());
});

router.post("/", (req, res) => {
  try {
    const newPatient = toNewPatientEntry(req.body as NewPatientEntry);
    const addedPatient = patientService.addPatient(newPatient);
    res.json(addedPatient);
  } catch (err) {
    if (err instanceof Error) {
      res.status(400).send(err.message);
    }
  }
});

export default router;
