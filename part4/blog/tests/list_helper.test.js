const listHelper = require('../utils/list_helper')

test('dummy returns one', () => {
	const blogs = []

	const result = listHelper.dummy(blogs)
	expect(result).toBe(1)
})

describe('total likes', () => {
	const listWithOneBlog = [
		{
			_id: '5a422aa71b54a676234d17f8',
			title: 'Go To Statement Considered Harmful',
			author: 'Edsger W. Dijkstra',
			url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
			likes: 5,
			__v: 0
		}
	]

	const listWithThreeBlogs = [
		{
			_id: '5a422aa71b54a676234d17f8',
			title: 'Go To Statement Considered Harmful',
			author: 'Edsger W. Dijkstra',
			url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
			likes: 5,
			__v: 0
		},
		{
			_id: '5a422a851b54a676234d17f7',
			title: 'React Patterns',
			author: 'Michael Chan',
			url: 'https://reactpatterns.com/',
			likes: 7,
			__v: 0
		},
		{
			_id: '5a422a851b54a676234d17f6',
			title: 'Canonical string reduction',
			author: 'Edsger W. Dijkstra',
			url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
			likes: 12,
			__v: 0
		}
	]

	test('of empty list is zero', () => {
		const result = listHelper.totalLikes([])
		expect(result).toBe(0)
	})

	test('when list has only one blog, equals the likes of that', () => {
		const result = listHelper.totalLikes(listWithOneBlog)
		expect(result).toBe(5)
	})

	test('of a bigger list is calculated right', () => {
		const result = listHelper.totalLikes(listWithThreeBlogs)
		expect(result).toBe(24)
	})
})

describe('find blog with highest likes', () => {
	const listWithOneBlog = [
		{
			_id: '5a422aa71b54a676234d17f8',
			title: 'Go To Statement Considered Harmful',
			author: 'Edsger W. Dijkstra',
			url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
			likes: 5,
			__v: 0
		}
	]

	const listWithThreeBlogsFirstHigh = [
		{
			_id: '5a422aa71b54a676234d17f8',
			title: 'Go To Statement Considered Harmful',
			author: 'Edsger W. Dijkstra',
			url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
			likes: 15,
			__v: 0
		},
		{
			_id: '5a422a851b54a676234d17f7',
			title: 'React Patterns',
			author: 'Michael Chan',
			url: 'https://reactpatterns.com/',
			likes: 9,
			__v: 0
		},
		{
			_id: '5a422a851b54a676234d17f6',
			title: 'Canonical string reduction',
			author: 'Edsger W. Dijkstra',
			url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
			likes: 7,
			__v: 0
		}
	]

	const listWithThreeBlogsMidHigh = [
		{
			_id: '5a422aa71b54a676234d17f8',
			title: 'Go To Statement Considered Harmful',
			author: 'Edsger W. Dijkstra',
			url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
			likes: 9,
			__v: 0
		},
		{
			_id: '5a422a851b54a676234d17f7',
			title: 'React Patterns',
			author: 'Michael Chan',
			url: 'https://reactpatterns.com/',
			likes: 15,
			__v: 0
		},
		{
			_id: '5a422a851b54a676234d17f6',
			title: 'Canonical string reduction',
			author: 'Edsger W. Dijkstra',
			url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
			likes: 7,
			__v: 0
		}
	]

	const listWithThreeBlogsLastHigh = [
		{
			_id: '5a422aa71b54a676234d17f8',
			title: 'Go To Statement Considered Harmful',
			author: 'Edsger W. Dijkstra',
			url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
			likes: 9,
			__v: 0
		},
		{
			_id: '5a422a851b54a676234d17f7',
			title: 'React Patterns',
			author: 'Michael Chan',
			url: 'https://reactpatterns.com/',
			likes: 7,
			__v: 0
		},
		{
			_id: '5a422a851b54a676234d17f6',
			title: 'Canonical string reduction',
			author: 'Edsger W. Dijkstra',
			url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
			likes: 15,
			__v: 0
		}
	]

	test('empty list returns null', () => {
		const result = listHelper.favoriteBlog([])
		expect(result).toBe(null)
	})

	test('list with one blog should return that blog', () => {
		const result = listHelper.favoriteBlog(listWithOneBlog)
		expect(result).toEqual(
			{
				title: 'Go To Statement Considered Harmful',
				author: 'Edsger W. Dijkstra',
				likes: 5
			}
		)
	})
	
	describe('3 element list where...', () => {
		test('...first element has the highest amount of likes', () => {
			const result = listHelper.favoriteBlog(listWithThreeBlogsFirstHigh)
			expect(result).toEqual({
				title: 'Go To Statement Considered Harmful',
				author: 'Edsger W. Dijkstra',
				likes: 15,
			})
		})

		test('...second element has the highest amount of likes', () => {
			const result = listHelper.favoriteBlog(listWithThreeBlogsMidHigh)
			expect(result).toEqual({
				title: 'React Patterns',
				author: 'Michael Chan',
				likes: 15,
			})
		})

		test('...third element has the highest amount of likes', () => {
			const result = listHelper.favoriteBlog(listWithThreeBlogsLastHigh)
			expect(result).toEqual({
				title: 'Canonical string reduction',
				author: 'Edsger W. Dijkstra',
				likes: 15,
			})
		})

	})
})

describe('find author with most blogs', () => {
	const listWithOneBlog = [
		{
			_id: '5a422aa71b54a676234d17f8',
			title: 'Go To Statement Considered Harmful',
			author: 'Edsger W. Dijkstra',
			url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
			likes: 5,
			__v: 0
		}
	]

	const listWithThreeBlogs = [
		{
			_id: '5a422aa71b54a676234d17f8',
			title: 'Go To Statement Considered Harmful',
			author: 'Edsger W. Dijkstra',
			url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
			likes: 5,
			__v: 0
		},
		{
			_id: '5a422a851b54a676234d17f7',
			title: 'React Patterns',
			author: 'Michael Chan',
			url: 'https://reactpatterns.com/',
			likes: 7,
			__v: 0
		},
		{
			_id: '5a422a851b54a676234d17f6',
			title: 'Canonical string reduction',
			author: 'Edsger W. Dijkstra',
			url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
			likes: 12,
			__v: 0
		}
	]

	test('empty list should return null', () => {
		const result = listHelper.mostBlogs([])
		expect(result).toBe(null)
	})

	test('list with one element', () => {
		const result = listHelper.mostBlogs(listWithOneBlog)
		expect(result).toEqual({author: 'Edsger W. Dijkstra', blogs: 1})
	})

	test('list with three elements', () => {
		const result = listHelper.mostBlogs(listWithThreeBlogs)
		expect(result).toEqual({author: 'Edsger W. Dijkstra', blogs: 2})
	})

	listHelper.mostBlogs(listWithThreeBlogs)
})

