import { Gender, type NewPatient } from './types.js';

const isString = (text: unknown): text is string => {
  return typeof text === 'string' || text instanceof String;
};

const parseString = (value: unknown): string => {
  if (!isString(value)) {
    throw new Error('Incorrect or missing string');
  }

  return value;
};

const isGender = (value: string): value is Gender => {
  return Object.values(Gender)
    .map(v => v.toString())
    .includes(value);
};

const parseGender = (value: unknown): Gender => {
  if (!isString(value) || !isGender(value)) {
    throw new Error('Incorrect or missing gender');
  }

  return value;
};

export const toNewPatient = (object: unknown): NewPatient => {
  if (!object || typeof object !== 'object') {
    throw new Error('Incorrect or missing data');
  }

  if (
    !('name' in object) ||
    !('dateOfBirth' in object) ||
    !('ssn' in object) ||
    !('gender' in object) ||
    !('occupation' in object)
  ) {
    throw new Error('Missing fields');
  }

  return {
    name: parseString(object.name),
    dateOfBirth: parseString(object.dateOfBirth),
    ssn: parseString(object.ssn),
    gender: parseGender(object.gender),
    occupation: parseString(object.occupation),
  };
};