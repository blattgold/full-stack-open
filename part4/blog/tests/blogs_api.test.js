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

	const blog = await Blog.findOne(newBlog)
	expect(blog).toBeTruthy()
})

test('likes property of blog is 0 if none provided', async() => {
	const newBlog = {
		title: 'First class tests',
		author: 'Robert C. Martin',
		url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.html'
	}

	await api
		.post('/api/blogs')
		.send(newBlog)
		.expect(201)
		.expect('Content-Type', /application\/json/)

	const blog = await Blog.findOne(newBlog)
	expect(blog).toBeTruthy()
	expect(blog.likes).toBe(0)
})

describe('expect 400 Bad Request status code when missing...', () => {
	test('...title', async () => {
		await api
			.post('/api/blogs')
			.send({
				author: 'Robert C. Martin',
				url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.html',
				likes: 10
			})
			.expect(400)
	})

	test('...url', async () => {
		await api
			.post('/api/blogs')
			.send({
				title: 'First class tests',
				author: 'Robert C. Martin',
				likes: 10
			})
			.expect(400)
	})

	test('...title and url', async () => {
		await api
			.post('/api/blogs')
			.send({
				author: 'Robert C. Martin',
				likes: 10
			})
			.expect(400)
	})
})

describe('DELETE /api/blogs/:id', () => {
	test('sending malformatted id gives 400 Bad Request', async () => {
		await api
			.delete('/api/blogs/1')
			.expect(400)
	})

	test('sending valid but not present id gives 204 No Content', async () => {
		const toDeleteId = new mongoose.Types.ObjectId()

		await api
			.delete(`/api/blogs/${toDeleteId}`)
			.expect(204)
	})

	test('deleting a resource', async () => {
		const toDeleteBlog = await Blog.findOne({title: 'React Patterns'})
		const toDeleteId = toDeleteBlog.toJSON().id

		await api
			.delete(`/api/blogs/${toDeleteId}`)
			.expect(204)

		const afterDeleteBlogs = await Blog.find({})
		expect(afterDeleteBlogs.length).toBe(2)

		const afterDeleteBlogsTitles = afterDeleteBlogs.map(blog => blog.title)
		expect(afterDeleteBlogsTitles).toContain('Go To Statement Considered Harmful')
		expect(afterDeleteBlogsTitles).toContain('Canonical string reduction')
	})
})

describe('PUT /api/blogs/:id', () => {
	test('sending malformatted id gives 400 Bad Request', async () => {
		await api
			.put('/api/blogs/1')
			.send({likes: 0})
			.expect(400)
	})

	test('sending valid but not present id gives 404 Not Found', async () => {
		const toDeleteId = new mongoose.Types.ObjectId()

		await api
			.put(`/api/blogs/${toDeleteId}`)
			.send({likes: 1})
			.expect(404)
	})

	test('updating only likes of an element', async () => {
		const toUpdateBlog = (await Blog.findOne({title: 'React Patterns'})).toJSON()

		await api
			.put(`/api/blogs/${toUpdateBlog.id}`)
			.send({likes: 200})
			.expect(200)

		const updatedBlog = (await Blog.findOne({title: 'React Patterns'})).toJSON()
		expect(updatedBlog).toEqual({...toUpdateBlog, likes: 200})
	})

	test('updating all properties of an element', async () => {
		const toUpdateBlog = (await Blog.findOne({title: 'React Patterns'})).toJSON()

		const newBlogProps = {
			title: 'title',
			author: 'author',
			url: 'url',
			likes: 100
		}

		await api
			.put(`/api/blogs/${toUpdateBlog.id}`)
			.send(newBlogProps)
			.expect(200)

		const updatedBlog = (await Blog.findOne(newBlogProps)).toJSON()
		expect(updatedBlog).toEqual({...toUpdateBlog, title: 'title', author: 'author', url: 'url', likes: 100})
	})
})

afterAll(async () => {
	await mongoose.connection.close()
})
