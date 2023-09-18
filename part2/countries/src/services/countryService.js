import axios from 'axios'
const baseUrl = 'https://studies.cs.helsinki.fi/restcountries/api'

const getAllCountries = () => {
	const request = axios.get(`${baseUrl}/all`)
	return request.then(response => response.data.map(country => country.name.common))
}

const getCountryInfo = country => {
	const request = axios.get(`${baseUrl}/name/${country}`)
	return request.then(response => response.data)
}

export default { getAllCountries, getCountryInfo }
