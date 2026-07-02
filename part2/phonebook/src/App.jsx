import { useEffect, useState } from 'react'
import axios from 'axios'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import personService from './services/persons'
import Notification from './components/Notification'

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState(0)
  const [search, setSearch] = useState('')
  const [notification, setNotification] = useState(null)

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])

  const addNames = (event) => {
    event.preventDefault()
    if (persons.some(person => person.name === newName)) {
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with the new?`)) {
        const existingPerson = persons.find(person => person.name === newName)
        const updatedPerson = {...existingPerson, number: newNumber}
        personService
          .update(existingPerson.id, updatedPerson)
          .then(returnedPerson => {
            setPersons(persons.map(p => p.id !== existingPerson.id ? p : returnedPerson))
            setNewName('')
            setNewNumber('')
            setNotification({message:`Updated ${returnedPerson.name}'s number`, type: 'success'})
            setTimeout(() => {
              setNotification(null)
            }, 5000)
          })
      }

    } else {
      const nameObject = {
      name: newName,
      number: newNumber,
    }
    personService
      .create(nameObject)
      .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson))
        setNewName('')
        setNewNumber('')
        setNotification({message:`Added ${returnedPerson.name}`, type: 'success'})
        setTimeout(() => {
          setNotification(null)
        }, 5000)
      })
    }
  }

  const removeNames = (id) => {
    const person = persons.find(p => p.id === id)
    if (window.confirm(`Delete ${person.name}?`)) {
      personService.remove(id).then(() => {
        setPersons(persons.filter(person => person.id !== id))
        setNotification({message: `Removed ${person.name}`, type: 'success'})
        setTimeout(() => setNotification(null), 5000)
      })
      .catch(error => {
        setNotification({message: `Info of ${person.name} has already been removed from the server`, type: 'error'})
        setTimeout(() => setNotification(null), 5000)
        setPersons(persons.filter(p => p.id !== id))
      })
    }
  }

  const handleNameChange = event => {
    setNewName(event.target.value)
  }

  const handleNumberChange = event => {
    setNewNumber(event.target.value)
  }

  const filteredPersons = persons.filter(person =>
    person.name.toLowerCase().includes(search.toLowerCase())
  )

  const handleSearchChange = event => {
    setSearch(event.target.value)
  }


  
  return (
    <div>
      <h2>Phonebook</h2>
      <Notification notification={notification}/>
      <Filter value={search} change={handleSearchChange}/>


      <h3>Add a new</h3>

      <PersonForm 
        onSubmit={addNames}
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
      />


      <h3>Numbers</h3>
      <Persons persons={filteredPersons} onDelete={removeNames}/>


    </div>
  )
}

export default App