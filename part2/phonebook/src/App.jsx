import { useState, useEffect } from 'react'
import personsService from './services/persons'

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

	useEffect(() => {
		personsService
			.getAll()
			.then(allPersons => {
				setPersons(allPersons)
		console.log(personsService.getAll())
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
				})
		} else {
			// person already in phonebook, update number
			if (confirm(`${newName} is already in the phonebook, replace old number with new one?`)) {
				personsService
					.update(persons.find(person => person.name.toLowerCase() == newPerson.name.toLowerCase()).id, newPerson)
					.then(returnedPerson => setPersons(persons.map(person => person.id == returnedPerson.id ? returnedPerson : person)))
					.catch(error => {
						// if person was deleted on server but still visible on client, remove off of client
						alert(`${newName} was deleted off the server`)
						setPersons(persons.filter(person => newPerson.name !== person.name))
					})
			}
		}
	}

	const handleDeletePerson = (id) => {
		if (window.confirm(`Delete ${persons.find(person => id == person.id).name}?`)) {
			personsService
				.del(id)
				.then(() => console.log(`successfully deleted person with id ${id}`))
				.catch(error => {
					alert(`person with id ${id} was already deleted from the server.`)
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
