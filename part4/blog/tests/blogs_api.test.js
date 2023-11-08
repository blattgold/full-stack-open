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
	const response = await api
		.get('/api/blogs')
		.expect(200)
		.expect('Content-Type', /application\/json/)

	expect(response.body.length).toBe(3)
})

test('id property should be called id and not _id', async () => {
	const response = await api
		.get('/api/blogs')
		.expect(200)
		.expect('Content-Type', /application\/json/)

	expect(response.body[0].id).toBeDefined()
})

test('successfully adds a blog with POST request', async () => {
	const newBlog = {
		title: 'First class tests',
		author: 'Robert C. Martin',
		url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.html',
		likes: 10
	}

	await api
		.post('/api/blogs')
		.send(newBlog)
		.expect(201)
		.expect('Content-Type', /application\/json/)

	const blogs = await Blog.find({})
	expect(blogs.length).toBe(4)

	const blogsNoId = blogs
		.map(blog => {
			const { id, ...rest } = blog.toJSON()
			return rest
		})
	expect(blogsNoId).toContainEqual(newBlog)
})

afterAll(async () => {
	await mongoose.connection.close()
})
