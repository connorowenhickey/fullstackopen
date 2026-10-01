interface ExerciseResult {
  periodLength: number
  trainingDays: number
  success: boolean
  rating: number
  ratingDescription: string
  target: number
  average: number
}

interface ExerciseValues {
  target: number
  dailyExerciseHours: number[]
}

export const calculateExercises = (
  dailyExerciseHours: number[],
  target: number
): ExerciseResult => {
  const periodLength = dailyExerciseHours.length;
  const trainingDays = dailyExerciseHours.filter(hours => hours > 0).length;
  const totalHours = dailyExerciseHours.reduce((sum, hours) => sum + hours, 0);
  const average = totalHours / periodLength;
  const success = average >= target;

  let rating: number;
  let ratingDescription: string;

  if (average >= target) {
    rating = 3;
    ratingDescription = 'great';
  } else if (average >= target * 0.5) {
    rating = 2;
    ratingDescription = 'not too bad but could be better';
  } else {
    rating = 1;
    ratingDescription = 'bad';
  }

  return {
    periodLength,
    trainingDays,
    success,
    rating,
    ratingDescription,
    target,
    average
  };
};

const parseArguments = (args: string[]): ExerciseValues => {
  if (args.length < 4) {
    throw new Error('Not enough arguments');
  }

  const target = Number(args[2]);
  const dailyExerciseHours = args.slice(3).map(Number);

  if (
    isNaN(target) ||
    dailyExerciseHours.some(hours => isNaN(hours))
  ) {
    throw new Error('Provided values were not numbers!');
  }

  return {
    target,
    dailyExerciseHours
  };
};

try {
  const { target, dailyExerciseHours } = parseArguments(process.argv);

  console.log(
    calculateExercises(dailyExerciseHours, target)
  );
} catch (error: unknown) {
  let errorMessage = 'Something bad happened.';

  if (error instanceof Error) {
    errorMessage += ` Error: ${error.message}`;
  }

  console.log(errorMessage);
}

