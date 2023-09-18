import { useState, useEffect } from 'react'
import countryService from './services/countryService'

const TextInput = ({ name, onChange, value }) => {
	return (
		<div>
		{name}<input
				onChange={onChange}
				value={value}
			/>
		</div>
	)
}

const DisplayCountryInfo = ({ currentCountry }) => {
	if (currentCountry.info === null) {
		return <></> 
	}
	return (
		<div>
			<h1>{currentCountry.info.name.common}</h1>
			<div>capital {currentCountry.info.capital}</div>
			<div>area {currentCountry.info.area}</div>
			<h2>languages:</h2>
			<ul>
				{(Object.entries(currentCountry.info.languages)).map(kv => <li key={kv[0]}>{kv[1]}</li>)}
			</ul>
			<img src={currentCountry.info.flags.png} alt={currentCountry.info.flags.alt}/>
		</div>
	)
}

const DisplayCountryList = ({ countries, makeHandleShowButton }) => {
	return countries.map(country => (
		<div key={country}>
			{country}
			<button onClick={makeHandleShowButton(country)}>show</button>
		</div>
	))
}

const DisplayCountries = ({ countries, currentCountry, setCurrentCountry, makeHandleShowButton, showButton }) => {
	if (countries.length == 1 && currentCountry.name != countries[0]) {
		countryService
			.getCountryInfo(countries[0])
			.then(returnedCountry => {
				setCurrentCountry({name: countries[0], info: returnedCountry})
			})
	}
	if (countries.length == 1 || showButton) {
		return (
			<DisplayCountryInfo
				currentCountry={currentCountry}
			/>
		)}
	else if (countries.length > 10) {
		return <div>Too many matches, specify another filter</div>
	}
	else if (countries.length > 1) {
		return (
			<DisplayCountryList
				countries={countries}
				makeHandleShowButton={makeHandleShowButton}
			/>
		)}

}

function App() {
	const [countries, setCountries] = useState([]) // stores names of all countries, for the search
	const [countryFilter, setCountryFilter] = useState('') // filter for searching countries
	const [currentCountry, setCurrentCountry] = useState({name: '', info: null}) // info for current country
	const [showButton, setShowButton] = useState(false)

	useEffect(() => {
		countryService
			.getAllCountries()
			.then(returnedCountries => {
				setCountries(returnedCountries)
			})
	}, [])

	const handleCountryFilterChange = (event) => {
		setCountryFilter(event.target.value)
		setShowButton(false)
	}

	const makeHandleShowButton = country => {
		return event => {
			countryService
				.getCountryInfo(country)
				.then(returnedInfo => {
					setCurrentCountry({name: country, info: returnedInfo})
					setShowButton(true)
				})
		}
	}

	const filteredCountries = countries.filter(country => country.toLowerCase().includes(countryFilter.toLowerCase()))



  return (
		<div>
			<TextInput 
				name={'find countries'}
				onChange={handleCountryFilterChange}
				value={countryFilter}
			/>
			<DisplayCountries
				countries={filteredCountries}
				currentCountry={currentCountry}
				setCurrentCountry={setCurrentCountry}
				makeHandleShowButton={makeHandleShowButton}
				showButton={showButton}
			/>
		</div>
  )
}

export default App
