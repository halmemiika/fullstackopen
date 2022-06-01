import express from "express";
const app = express();
app.use(express.json());

import { calculateBmi } from "./bmiCalculator";
import { calculateExercises } from "./exerciseCalculator";

app.get("/hello", (_req, res) => {
  res.send("Hello Full Stack!");
});

app.get("/bmi", (req, res) => {
  const { weight, height } = req.query;
  if (!isNaN(Number(weight)) && !isNaN(Number(height))) {
    res.json({
      weight: Number(weight),
      height: Number(height),
      bmi: calculateBmi(Number(height), Number(weight)),
    });
  } else {
    res.status(400).json({
      error: "malformatted parameters",
    });
  }
});

app.post("/exercises", (req, res) => {
  const { daily_exercises, target } = req.body;

  if (!daily_exercises || !target) {
    res.status(400).json({
      error: "parameters missing",
    });
  } else if (
    daily_exercises.every((day: number) => !isNaN(Number(day))) &&
    !isNaN(Number(target))
  ) {
    res.json(calculateExercises(daily_exercises, target));
  } else {
    res.status(400).json({
      error: "malformatted parameters",
    });
  }
});

const PORT = 3003;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
