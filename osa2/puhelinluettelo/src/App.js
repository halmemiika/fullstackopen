import React, { useState, useEffect } from "react";
import phoneBookService from "./services/persons";

const Notification = ({ message, messageClass }) => {
  if (message === null) {
    return null;
  } else if (messageClass === "success") {
    return <div className="success">{message}</div>;
  } else if (messageClass === "error") {
    return <div className="error">{message}</div>;
  }
};

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

const Persons = ({ persons, deleteEntry }) => {
  return (
    <>
      {persons.map((person) => (
        <p key={person.id}>
          {person.name} {person.number}
          <button onClick={() => deleteEntry(person.id)}>delete</button>
        </p>
      ))}
    </>
  );
};

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setnewNumber] = useState("");
  const [showAll, setShowAll] = useState(true);
  const [filterRule, setFilter] = useState("");
  const [message, setMessage] = useState(null);
  const [messageClass, setMessageClass] = useState("success");

  useEffect(() => {
    phoneBookService
      .getAll()
      .then((intialNumbers) => setPersons(intialNumbers));
  }, []);

  const addName = (event) => {
    event.preventDefault();
    const nameObject = {
      name: newName,
      number: newNumber,
    };
    const person = persons.find((person) => person.name === newName);
    if (person && person.number !== newNumber) {
      if (
        window.confirm(
          `${newName} is already added to phonebook, replace the old number with a new one?`
        )
      ) {
        phoneBookService
          .update(person.id, nameObject)
          .then((data) => {
            setPersons(
              persons.map((newPerson) =>
                newPerson.id !== data.id ? newPerson : data
              )
            );
            setMessage(`Changed number of ${person.name} successfully.`);
            setTimeout(() => {
              setMessage(null);
            }, 5000);
            setNewName("");
            setnewNumber("");
          })
          .catch((error) => {
            setMessage(
              `Information of ${person.name} has already been removed from server`
            );
            setMessageClass("error");
            setTimeout(() => {
              setMessage(null);
              setMessageClass("success");
            }, 5000);
          });
      }
    } else if (person && person.number === newNumber) {
      alert(`${person.name} is already added to the phonebook!`);
    } else {
      phoneBookService
        .create(nameObject)
        .then((data) => {
          setPersons(persons.concat(data));
          setMessage(`Added ${newName}`);
          setTimeout(() => {
            setMessage(null);
          }, 5000);
          setNewName("");
          setnewNumber("");
        })
        .catch((err) => {
          const message = err.response.data.error;
          setMessage(message);
          setMessageClass("error");
          setTimeout(() => {
            setMessage(null);
            setMessageClass("success");
          }, 5000);
        });
    }
  };

  const deleteEntry = (id) => {
    const personEntry = persons.find((n) => n.id === id);
    const copyData = { ...personEntry };
    if (window.confirm(`Delete ${personEntry.name}`)) {
      phoneBookService
        .deleteEntry(id, copyData)
        .then((data) =>
          setPersons(
            persons
              .map((person) => (person.id !== id ? person : data))
              .filter((person) => person.name !== undefined)
          )
        );
      setMessage(`Deleted ${personEntry.name}`);
      setTimeout(() => {
        setMessage(null);
      }, 5000);
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
      <Notification message={message} messageClass={messageClass} />
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
      <Persons persons={namesToShow} deleteEntry={deleteEntry} />
    </div>
  );
};

export default App;
