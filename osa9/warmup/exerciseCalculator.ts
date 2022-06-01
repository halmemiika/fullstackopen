interface Result {
  periodLength: number;
  trainingDays: number;
  success: boolean;
  rating: number;
  ratingDescription: string;
  target: number;
  average: number;
}

interface Data {
  target: number;
  days: number[];
}

const parseArgument = (arg: Array<string>): Data => {
  if (arg.length < 4) throw new Error("Not enough arguments");

  const days = arg.slice(3).map(Number);
  if (!isNaN(Number(arg[2])) && days.every((num) => !isNaN(Number(num)))) {
    return {
      target: Number(arg[2]),
      days,
    };
  } else {
    throw new Error("Provided values were not numbers!");
  }
};

export const calculateExercises = (exercises: number[], target: number) => {
  const days = exercises.length;
  const trainingDays = exercises.filter((day) => day > 0).length;
  const total = exercises.reduce((sum, a) => sum + a, 0);
  const success = total / days > target;
  const average = total / days;
  let rating;
  let desc;
  if (average + 1 < target) {
    rating = 1;
    desc = "Poor";
  } else if (average < target) {
    rating = 2;
    desc = "Almost";
  } else {
    rating = 3;
    desc = "Great";
  }

  const result: Result = {
    periodLength: days,
    trainingDays,
    success,
    rating,
    ratingDescription: desc,
    target,
    average,
  };

  return result;
};

try {
  const { target, days } = parseArgument(process.argv);
  calculateExercises(days, target);
} catch (err) {
  let errorMessage = "Something bad happened.";
  if (err instanceof Error) {
    errorMessage += " Error: " + err.message;
  }
  console.log(errorMessage);
}
