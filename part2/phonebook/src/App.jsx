import { useState, useEffect } from 'react'
import personsService from './services/persons'

import './index.css'

const DisplayPerson = ({person}) => <>{person.name} {person.number}</>

const DisplayPersons = ({ persons, deleteHandler }) => {
	return (persons.map(person => 
		<div key={person.id}>
			<DisplayPerson person={person} />
			<button onClick={() => deleteHandler(person.id)}>delete</button>
		</div>
	))
}

const SearchFilter = ({ onChange, value }) => {
	return (
		<div>
			filter shown with <input
				onChange={onChange}
				value={value}
			/>
		</div>
	)
}

const Input = ({name, onChange, value}) => {
	return (
		<div>
		{name}: 
				<input
					onChange={onChange}
					value={value}
				/>
		</div>
	)
}

const Notification = ({ message }) => {
	if (message === null) {
		return null
	}

	return (
		<div className={message[1] === 0 ? 'notif' : 'error'}>
			{message[0]}
		</div>
	)
}

const PersonForm = ({onSubmit, nameOnChange, nameValue, numberOnChange, numberValue}) => {
	return (
		<form onSubmit={onSubmit}>
			<Input name='name' onChange={nameOnChange} value={nameValue} />
			<Input name='number' onChange={numberOnChange} value={numberValue} />
			<button type='submit'>add</button>
		</form>
	)
}

const App = () => {
	const [persons, setPersons] = useState([])
	const [newName, setNewName] = useState('')
	const [newNumber, setNewNumber] = useState('')
	const [searchFilter, setSearchFilter] = useState('')
	const [message, setMessage] = useState(null) // ['message', severity (0: notification, 1: error)] 

	useEffect(() => {
		personsService
			.getAll()
			.then(allPersons => {
				setPersons(allPersons)
			})
	}, [])

	const addPerson = (event) => {
		event.preventDefault()
		const newPerson = {name: newName, number: newNumber}

		if (persons.every(person => person.name.toLowerCase() !== newPerson.name.toLowerCase())) {
			// person not in phonebook
			personsService
				.create(newPerson)
				.then(returnedPerson => {
					setPersons(persons.concat(returnedPerson))
					setMessage([`Added ${returnedPerson.name} to the Phonebook`, 0])
					setTimeout(() => {
						setMessage(null)
					}, 5000)
				})
		} else {
			// person already in phonebook, update number
			if (confirm(`${newName} is already in the phonebook, replace old number with new one?`)) {
				personsService
					.update(persons.find(person => person.name.toLowerCase() == newPerson.name.toLowerCase()).id, newPerson)
					.then(returnedPerson => {
						setPersons(persons.map(person => person.id == returnedPerson.id ? returnedPerson : person))
						setMessage([`Replaced the number of ${returnedPerson.name}`, 0])
						setTimeout(() => {
							setMessage(null)
						}, 5000)
					})
					.catch(error => {
						// if person was deleted on server but still visible on client, remove off of client
						setPersons(persons.filter(person => newPerson.name !== person.name))
						setMessage([`${newName} was deleted off the server`, 1])
						setTimeout(() => {
							setMessage(null)
						}, 5000)
					})
			}
		}
	}

	const handleDeletePerson = (id) => {
		const personToDeleteName = persons.find(person => id == person.id).name

		if (window.confirm(`Delete ${personToDeleteName}?`)) {
			personsService
				.del(id)
				.then(() => {
					setMessage([`deleted ${personToDeleteName} from Phonebook`])
					setTimeout(() => {
						setMessage(null)
					}, 5000)
				})
				.catch(error => {
					setMessage([`${personToDeleteName} was already deleted from the server.`, 1])
					setTimeout(() => {
						setMessage(null)
					}, 5000)
				})
			setPersons(persons.filter(person => id !== person.id))
		}
	}

	const handleNewNameChange = (event) => {
		setNewName(event.target.value)
	}

	const handleNewNumberChange = (event) => {
		setNewNumber(event.target.value)
	}
	
	const handleSearchFilterChange = (event) => {
		setSearchFilter(event.target.value)
	}

	const personsToShow = searchFilter === '' 
		? persons
		: persons.filter((person) => person.name.toLowerCase().includes(searchFilter.toLowerCase()))

	return (
		<div>
			<h2>Phonebook</h2>	
			<Notification message={message} />
			<SearchFilter onChange={handleSearchFilterChange} value={searchFilter} />
			<PersonForm 
				onSubmit={addPerson} 
				nameOnChange={handleNewNameChange} 
				nameValue={newName}
				numberOnChange={handleNewNumberChange}
				numberValue={newNumber}
			/>
			<h2>Numbers</h2>
			<DisplayPersons persons={personsToShow} deleteHandler={handleDeletePerson} />
		</div>
	)
}

export default App
