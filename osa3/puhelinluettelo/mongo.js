const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log("give password as argument");
  process.exit(1);
}

const password = process.argv[2];
const name = process.argv[3];
const number = process.argv[4];

const url = `mongodb+srv://fullstackopen:${password}@cluster0.7q6gp.mongodb.net/phonebook?retryWrites=true&w=majority`;

mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model("Person", personSchema);

if (number === undefined && name === undefined) {
  Person.find({}).then((res) => {
    console.log("phonebook:");
    res.forEach((person) => {
      console.log(person.name, person.number);
    });
    mongoose.connection.close();
  });
} else if (number === undefined) {
  console.log("Please give a number");
  mongoose.connection.close();
} else {
  const person = new Person({
    name: name,
    number: number,
  });

  person.save().then((res) => {
    console.log(`Added ${res.name} number ${res.number} to phonebook`);
    mongoose.connection.close();
  });
}
