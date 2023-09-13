import { useState, useEffect } from 'react'
import axios from 'axios'

const DisplayPerson = ({person}) => <>{person.name} {person.number}</>

const DisplayPersons = ({ persons }) => {
	return (persons.map(person => 
		<div key={person.id}>
			<DisplayPerson person={person} />
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
		axios
			.get('http://localhost:3001/persons')
			.then(response => {
				setPersons(response.data)
			})
	}, [])

	const addPerson = (event) => {
		event.preventDefault()
		const newPerson = {id: persons.length,name: newName, number: newNumber}

		// add person if person with same name not yet already present
		if (persons.every(person => person.name !== newPerson.name)) {
			setPersons(persons.concat(newPerson))
			setNewName('')
		} else {
			alert(`${newName} is already in the phonebook`)
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

	// apply filter
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
			<DisplayPersons persons={personsToShow} />
		</div>
	)
}

export default App