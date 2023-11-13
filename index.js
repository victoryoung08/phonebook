const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");

const requestLogger = morgan((tokens, req, res) => {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    JSON.stringify(req.body),
  ].join(" ");
});

app.use(requestLogger);
app.use(cors());
app.use(express.json());
app.use(express.static("dist"));

let phonebook = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/", (request, response) => {
  response.send("<h1>Hello world</h1>");
});

app.get("/api/persons", (request, response) => {
  response.json(phonebook);
});

app.get("/info", (request, response) => {
  response.send(`
  <p>
  Phonebook has info for ${phonebook.length} people
  </p> </br>
  ${new Date()}
  `);
});

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  console.log(id);
  const person = phonebook.find((p) => p.id === id);
  if (person) {
    response.json(person);
  } else {
    response.statusMessage = "Person doesn't exist";
    response.status(404).end();
  }
});

// POST Add to phonebook
app.post("/api/persons", (request, response) => {
  const body = request.body;
  if (!body.name) {
    return response.status(400).json({
      error: "name missing",
    });
  }
  if (!body.number) {
    return response.status(400).json({
      error: "number missing",
    });
  }

  const alreadyExists = phonebook.find((p) => p.name === body.name);

  if (alreadyExists) {
    return response.status(400).json({
      error: "name must be unique",
    });
  }

  const person = {
    name: body.name,
    number: body.number,
    id: generateId(),
  };
  phonebook = phonebook.concat(person);
  response.json(person);
});

function generateId() {
  return Math.floor(Math.random() * 100000);
}

const PORT = process.env.PORT || 3001;
app.listen(PORT);
console.log(`server is running on ${PORT}`);
