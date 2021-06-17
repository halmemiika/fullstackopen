const express = require("express");
const morgan = require("morgan");
const app = express();

app.use(express.json());

morgan.token("json", (req, res) => {
  const method = req.method;
  if (method === "POST") {
    return JSON.stringify(req.body);
  }
});
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :json")
);

let persons = [
  {
    name: "Arto Hellas",
    number: "040-123456",
    id: 1,
  },
  {
    name: "Ada Lovelace",
    number: "39-44-5323523",
    id: 2,
  },
  {
    name: "Dan Abramov",
    number: "12-43-234345",
    id: 3,
  },
  {
    name: "Mary Poppendieck",
    number: "39-23-6423122",
    id: 4,
  },
];

app.get("/api/persons", (req, res) => {
  res.json(persons);
});

app.get("/info", (req, res) => {
  const currentTime = new Date().toString();
  res.send(`<p>Phonebook has info for ${persons.length} people</p>
    <p>${currentTime}</p>`);
});

app.get("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find((person) => person.id === id);
  if (person) {
    res.json(person);
  } else {
    res.status(404).end();
  }
});

app.delete("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  persons = persons.filter((person) => person.id !== id);
  res.status(204).end();
});

const generateId = () => {
  const ids = persons.map((p) => p.id);
  let newId = Math.floor(Math.random() * 20) + 1;
  while (ids.includes(newId)) {
    newId = Math.floor(Math.random() * 20) + 1;
  }
  return newId;
};

app.post("/api/persons", (req, res) => {
  const body = req.body;
  const names = persons.map((p) => p.name);
  if (!body.name || !body.number) {
    return res.status(400).json({
      error: "No name or number",
    });
  } else if (names.includes(body.name)) {
    return res.status(400).json({
      error: "Name must be unique",
    });
  }

  const person = {
    name: body.name,
    number: body.number,
    id: generateId(),
  };

  persons = persons.concat(person);

  res.json(person);
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
