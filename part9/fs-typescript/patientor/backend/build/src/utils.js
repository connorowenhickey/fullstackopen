import { Gender } from './types.js';
const isString = (text) => {
    return typeof text === 'string' || text instanceof String;
};
const parseString = (value) => {
    if (!isString(value)) {
        throw new Error('Incorrect or missing string');
    }
    return value;
};
const isGender = (value) => {
    return Object.values(Gender)
        .map(v => v.toString())
        .includes(value);
};
const parseGender = (value) => {
    if (!isString(value) || !isGender(value)) {
        throw new Error('Incorrect or missing gender');
    }
    return value;
};
export const toNewPatient = (object) => {
    if (!object || typeof object !== 'object') {
        throw new Error('Incorrect or missing data');
    }
    if (!('name' in object) ||
        !('dateOfBirth' in object) ||
        !('ssn' in object) ||
        !('gender' in object) ||
        !('occupation' in object)) {
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
//# sourceMappingURL=utils.js.map