import { useState } from 'react'

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 10 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
    'The only way to go fast, is to go well.'
  ]
  const randomIndexAnecdote = () => Math.floor(Math.random() * anecdotes.length) 
  const [selected, setSelected] = useState(randomIndexAnecdote())
	const [votes, setVotes] = useState(Array(anecdotes.length).fill(0))

	const onClickAnecdote = () => {
		let nextIndex = selected
		// only go into loop if length is more than 1, to prevent infinite loop
		if (anecdotes.length > 1) {
			// keep generating until nextIndex is different from previous one
			while (nextIndex == selected) {
				nextIndex = randomIndexAnecdote()
			}
		}
		setSelected(nextIndex)
	}

	const onClickVote = () => {
		const copy = [...votes]
		copy[selected] += 1
		setVotes(copy)
	}

	const findMostVotedAnecdoteIndex = () => {
		let maxI = 0
		for (const [index, element] of votes.entries()) {
			if (votes[maxI] < element) {
				maxI = index
			}
		}
		return maxI
	}

	const mostVotedAnecdoteIndex = findMostVotedAnecdoteIndex()

  return (
    <div>
			<h1>Anecdote of the day</h1>
			<DisplayAnecdote selected={selected} anecdotes={anecdotes} />
			<DisplayVotes selected={selected} votes={votes} />
			<Button name="vote" onClick={onClickVote} />
			<Button name="next anecdote" onClick={onClickAnecdote} />
			<h1>Anecdote with most votes</h1>
			<DisplayAnecdote selected={mostVotedAnecdoteIndex} anecdotes={anecdotes} />
			<DisplayVotes selected={mostVotedAnecdoteIndex} votes={votes} />
    </div>
  )
}

const DisplayAnecdote = ({selected, anecdotes}) => <div>{anecdotes[selected]}</div>
const DisplayVotes = ({selected, votes}) => <div>has {votes[selected]} votes</div>
const Button = ({name, onClick}) => <button onClick={onClick} >{name}</button>

export default App
