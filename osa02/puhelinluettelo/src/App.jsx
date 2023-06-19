import { useEffect, useState } from "react";
import personsService from "./services/persons";

const Notification = ({ notification }) => {
  if (notification === null) {
    return null;
  }

  const className = notification.type === "error" ? "error" : "success";

  return <div className={className}>{notification.message}</div>;
};

const Filter = ({ filter, setFilter }) => {
  return (
    <div>
      filter shown with
      <input value={filter} onChange={(e) => setFilter(e.target.value)} />
    </div>
  );
};

const PersonForm = ({
  handleSubmit,
  newName,
  setNewName,
  newNumber,
  setNewNumber,
}) => {
  return (
    <form onSubmit={(e) => handleSubmit(e)}>
      <div>
        name:
        <input value={newName} onChange={(e) => setNewName(e.target.value)} />
      </div>
      <div>
        number:
        <input
          value={newNumber}
          onChange={(e) => setNewNumber(e.target.value)}
        />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  );
};

const Persons = ({ filteredPersons, deletePerson }) => {
  return (
    <ul>
      {filteredPersons.map((person) => (
        <li key={person.id}>
          {`${person.name} ${person.number} `}
          <button onClick={() => deletePerson(person.id)}>Delete</button>
        </li>
      ))}
    </ul>
  );
};

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [filter, setFilter] = useState("");
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    personsService.getAll().then((allPersons) => setPersons(allPersons));
  }, []);

  const addNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const existingPerson = persons.find((person) => person.name === newName);

    if (!existingPerson) {
      const newPerson = { name: newName, number: newNumber };
      personsService.create(newPerson).then((person) => {
        setPersons(persons.concat(person));
        setNewName("");
        setNewNumber("");
        addNotification(`Added ${newName}`, "success");
      });
      return;
    }

    const replace = confirm(
      `${newName} is already added to phonebook, replace the old number with a new one?`
    );

    if (!replace) {
      return;
    }

    personsService
      .update(existingPerson.id, {
        ...existingPerson,
        number: newNumber,
      })
      .then((person) => {
        setPersons(
          persons.filter((per) => per.id !== person.id).concat(person)
        );
        setNewName("");
        setNewNumber("");
        addNotification(`Updated ${newName}`, "success");
      })
      .catch(() =>
        addNotification(
          `Information of ${newName} has already been removed from server`,
          "error"
        )
      );
  };

  const deletePerson = (id) => {
    personsService.remove(id).then(() => {
      const personName = persons.find((person) => person.id === id).name;
      setPersons(persons.filter((person) => person.id !== id));
      addNotification(`Deleted ${personName}`, "success");
    });
  };

  const getFilteredPersons = () => {
    return persons.filter(({ name }) =>
      name.toLocaleLowerCase().startsWith(filter.toLocaleLowerCase())
    );
  };

  return (
    <div>
      <h1>Phonebook</h1>
      <Notification notification={notification} />
      <Filter filter={filter} setFilter={setFilter} />
      <h2>add a new</h2>
      <PersonForm
        handleSubmit={handleSubmit}
        newName={newName}
        setNewName={setNewName}
        newNumber={newNumber}
        setNewNumber={setNewNumber}
      />
      <h2>Numbers</h2>
      <Persons
        filteredPersons={getFilteredPersons()}
        deletePerson={deletePerson}
      />
    </div>
  );
};

export default App;
