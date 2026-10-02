import express from 'express';
import diagnosesRouter from './routes/diagnoses.js';
import patientsRouter from './routes/patients.js';
const app = express();
app.use(express.json());
app.get('/api/ping', (_req, res) => {
    res.send('pong');
});
app.use('/api/diagnoses', diagnosesRouter);
app.use('/api/patients', patientsRouter);
const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
//# sourceMappingURL=index.js.map