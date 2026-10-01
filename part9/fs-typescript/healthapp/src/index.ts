import express from 'express';
import { calculateBmi } from '../bmiCalculator.ts';
import { calculateExercises } from '../exerciseCalculator.ts';


const app = express();
app.use(express.json());

app.get('/hello', (_req, res) => {
  res.send('Hello Full Stack!');
});

app.get('/bmi', (req, res) => {
  const height = Number(req.query.height);
  const weight = Number(req.query.weight);

  if (
    !req.query.height ||
    !req.query.weight ||
    isNaN(height) ||
    isNaN(weight)
  ) {
    return res.status(400).json({
      error: 'malformatted parameters'
    });
  }

  return res.json({
    weight,
    height,
    bmi: calculateBmi(height, weight)
  });
});

app.post('/exercises', (req, res) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { daily_exercises, target } = req.body;

  if (!daily_exercises || !target) {
    return res.status(400).json({
      error: 'parameters missing'
    });
  }

  if (
    !Array.isArray(daily_exercises) ||
    isNaN(Number(target)) ||
    daily_exercises.some((value) => isNaN(Number(value)))
  ) {
    return res.status(400).json({
      error: 'malformatted parameters'
    });
  }

  const exercises = daily_exercises.map(Number);

  return res.json(
    calculateExercises(exercises, Number(target))
  );
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});