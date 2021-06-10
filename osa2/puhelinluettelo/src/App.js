import React, { useState } from "react";

const Filter = ({ handleFilter }) => {
  return (
    <>
      filter shown with <input onChange={handleFilter} />
    </>
  );
};

const PersonForm = ({ addName, newName, newNumber, nameChange, numChange }) => {
  return (
    <form onSubmit={addName}>
      <div>
        name: <input value={newName} onChange={nameChange} />
      </div>
      <div>
        number: <input value={newNumber} onChange={numChange} />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  );
};

const Persons = ({ persons }) => {
  return (
    <>
      {persons.map((person) => (
        <p key={person.name}>
          {person.name} {person.number}
        </p>
      ))}
    </>
  );
};

const App = () => {
  const [persons, setPersons] = useState([
    { name: "Arto Hellas", number: "040-123456" },
    { name: "Ada Lovelace", number: "39-44-5323523" },
    { name: "Dan Abramov", number: "12-43-234345" },
    { name: "Mary Poppendieck", number: "39-23-6423122" },
  ]);
  const [newName, setNewName] = useState("");
  const [newNumber, setnewNumber] = useState("");
  const [showAll, setShowAll] = useState(true);
  const [filterRule, setFilter] = useState("");

  const addName = (event) => {
    event.preventDefault();
    const nameObject = {
      name: newName,
      number: newNumber,
    };
    if (persons.find((person) => person.name === newName) !== undefined) {
      alert(`${newName} is already added to phonebook`);
    } else {
      setPersons(persons.concat(nameObject));
      setNewName("");
      setnewNumber("");
    }
  };

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };

  const handleNumChange = (event) => {
    setnewNumber(event.target.value);
  };

  const handleFilter = (event) => {
    setFilter(event.target.value.toLowerCase());
    setShowAll(!setShowAll);
  };

  const namesToShow = showAll
    ? persons
    : persons.filter(
        (person) => person.name.toLowerCase().indexOf(filterRule) !== -1
      );

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter handleFilter={handleFilter} />
      <h3>Add a new</h3>
      <PersonForm
        addName={addName}
        newName={newName}
        newNumber={newNumber}
        nameChange={handleNameChange}
        numChange={handleNumChange}
      />
      <h3>Numbers</h3>
      <Persons persons={namesToShow} />
    </div>
  );
};

export default App;
