import { v1 as uuid } from 'uuid';
import patients from '../../data/patients.js';
const getEntries = () => {
    return patients.map(({ id, name, dateOfBirth, gender, occupation }) => ({
        id,
        name,
        dateOfBirth,
        gender,
        occupation
    }));
};
const addPatient = (patient) => {
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
//# sourceMappingURL=patientService.js.map