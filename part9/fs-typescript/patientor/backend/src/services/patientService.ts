import { v1 as uuid } from 'uuid';

import patients from '../../data/patients.js';
import type { NewPatient, Patient, PublicPatient } from '../types.js';


const getEntries = (): PublicPatient[] => {
  return patients.map(
    ({ id, name, dateOfBirth, gender, occupation }) => ({
      id,
      name,
      dateOfBirth,
      gender,
      occupation
    })
  );
};

const addPatient = (patient: NewPatient): Patient => {
  const newPatient = {
    id: uuid(),
    ...patient
  };

  patients.push(newPatient);

  return newPatient;
};
export default {
  getEntries,
  addPatient
};