interface Details {
  height: number;
  weight: number;
}

const parseArguments = (args: Array<string>): Details => {
  if (args.length < 4) throw new Error("Not enough arguments");
  if (args.length > 4) throw new Error("Too many arguments");

  if (!isNaN(Number(args[2])) && !isNaN(Number(args[3]))) {
    return {
      height: Number(args[2]),
      weight: Number(args[3]),
    };
  } else {
    throw new Error("Provided values were not numbers!");
  }
};

export const calculateBmi = (h: number, w: number) => {
  const bmi: number = w / Math.pow(h / 100, 2);
  if (bmi <= 18.4) {
    return "Underweight";
  } else if (bmi > 18.5 && bmi < 25) {
    return "Normal (healthy weight)";
  } else {
    return "Overweight";
  }
};

try {
  const { height, weight } = parseArguments(process.argv);
  calculateBmi(height, weight);
} catch (err) {
  let errorMessage = "Something bad happened.";
  if (err instanceof Error) {
    errorMessage += " Error: " + err.message;
  }
  console.log(errorMessage);
}
