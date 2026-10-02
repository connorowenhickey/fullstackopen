import diagnoses from '../../data/diagnoses.js';
import type { Diagnose } from '../types.js';

const getEntries = (): Diagnose[] => {
  return diagnoses;
};

export default {
  getEntries
};