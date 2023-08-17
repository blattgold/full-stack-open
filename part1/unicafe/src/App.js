import { useState } from 'react'

const App = () => {
	// save clicks of each button to its own state
	const [good, setGood] = useState(0)
	const [neutral, setNeutral] = useState(0)
	const [bad, setBad] = useState(0)

	const onClickGood = () => setGood(good + 1)
	const onClickNeutral = () => setNeutral(neutral + 1)
	const onClickBad = () => setBad(bad + 1)

	return (
		<div>
			<h1>give feedback</h1>
			<div>
				<Button name="good" onClick={onClickGood} />
				<Button name="neutral" onClick={onClickNeutral} />
				<Button name="bad" onClick={onClickBad} />
			</div>
			<Statistics good={good} neutral={neutral} bad={bad} />
		</div>
	)
}

const Button = ({name, onClick}) => {
	return (
		<button onClick={onClick} >{name}</button>
	)
}

const Statistics = ({good, neutral, bad}) => {
	if (good + neutral + bad == 0) {
		return (
			<div>
				<h1>statistics</h1>
				<div>No feedback given</div>
			</div>
		)
	}

	return (
		<div>
			<h1>statistics</h1>
			<table>
				<tbody>
					<StatisticLine name="good" value={good} />
					<StatisticLine name="neutral" value={neutral} />
					<StatisticLine name="bad" value={bad} />
					<StatisticLine name="all" value={good + neutral + bad} />
					<StatisticLine name="average" value={((-bad + good) / (good + neutral + bad)).toFixed(2)} />
					<StatisticLine name="positive" value={(good / (good + neutral + bad))
						.toLocaleString(undefined, {style: 'percent', minimumFractionDigits:2})} />
				</tbody>
			</table>
		</div>
	)
}

const StatisticLine = ({name, value}) => {
	return (
		<tr>
			<td>{name}</td> 
			<td>{value}</td>
		</tr>)
}

export default App;
