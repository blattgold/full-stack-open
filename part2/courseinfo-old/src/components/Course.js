const Header = ({ course }) => <h2>{course}</h2>

const Total = ({ sum }) => <b>total of {sum} exercises</b>

const Part = ({ name, exercises }) =>
	<p>
		{name} {exercises}
	</p>

const Content = ({ parts }) =>
	<>
		{parts.map(part => 
			<Part 
				key={part.id} 
				name={part.name}
				exercises={part.exercises}
			/>
		)}
	</>

const Course = ({ name, parts }) => {
	return (
		<>
			<Header course={name} />
			<Content parts={parts} />
			<Total sum={parts.reduce((acc, part) => part.exercises + acc, 0)} />
		</>
	)
}

export default Course
