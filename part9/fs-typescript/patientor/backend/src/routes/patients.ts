import express from 'express';
import patientService from '../services/patientService.js';
import { NewPatientSchema } from '../types.js';

const router = express.Router();

router.get('/', (_req, res) => {
  res.send(patientService.getEntries());
});

router.post('/', (req, res) => {
  const result = NewPatientSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).send({
      error: result.error.issues,
    });
  }

  const addedPatient = patientService.addPatient(result.data);

  return res.json(addedPatient);
});

export default router;