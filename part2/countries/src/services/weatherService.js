import axios from 'axios'
const apiKey = import.meta.env.VITE_WEATHER_API_KEY
const getUrl = (lat, lon) => `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}` 

const getCapitalWeather = (lat, lon) => {
	const request = axios.get(getUrl(lat, lon))
	return request.then(response => response.data)
}

export default { getCapitalWeather }
