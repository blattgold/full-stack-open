const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')

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

beforeEach(async () => {
	await Blog.deleteMany({})

	for (let note of listWithThreeBlogs) {
		let blogObject = new Blog(note)
		await blogObject.save()
	}
})

test('contains the right amount of blogs', async () => {
	const blogs = await api
		.get('/api/blogs')
		.expect(200)
		.expect('Content-Type', /application\/json/)
	expect(blogs.body.length).toBe(3)
})

afterAll(async () => {
	await mongoose.connection.close()
})
