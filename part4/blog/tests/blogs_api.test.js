const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const User = require('../models/user')

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

const listWithTwoUsers = [
	{
		_id: '655532630970669abf7c7b3a',
		username: 'root',
		name: '',
		passwordHash: '$2b$10$0Mx5qdwmtYJyAQ77UXQH6uNhPatma2jWUS2EwRKS5OZ0gj0N/aLXW', //root
		blogs: [],
		__v: 0
	},
	{
		_id: '655532720970669abf7c7b3c',
		username: 'user',
		name: '',
		passwordHash: '$2b$10$BoWzoH4ViGXf9jg1QhqVvegrCj1tZtChU8c0qbv4E2bh0G06iPm4e', //user
		blogs: [],
		__v: 0
	}
]

const userTokens = {
	root: 'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InJvb3QiLCJpZCI6IjY1NTUzMjYzMDk3MDY2OWFiZjdjN2IzYSIsImlhdCI6MTcwMDA4Mjg5NX0.dfvX-NUjAuJY12VQE9ff3Ip77GiDsIA2ALzGU4Rybn8',
	user: 'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InVzZXIiLCJpZCI6IjY1NTUzMjcyMDk3MDY2OWFiZjdjN2IzYyIsImlhdCI6MTcwMDA4MjgyNH0.r8VI3pL5U4R3OVtjvP-ZuNqkAJ1i-dmSA2XecZTVzZE'
}

beforeAll(async () => {
	await User.deleteMany({})

	for (let user of listWithTwoUsers) {
		let userObject = new User(user)
		await userObject.save()
	}
})

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

describe('POST /api/blogs', () => {
	test('successfully adds a blog', async () => {
		const newBlog = {
			title: 'First class tests',
			author: 'Robert C. Martin',
			url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.html',
			likes: 10
		}

		await api
			.post('/api/blogs')
			.send(newBlog)
			.set({ Authorization: userTokens.root })
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
			.set({ Authorization: userTokens.user })
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
				.set({ Authorization: userTokens.root })
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
				.set({ Authorization: userTokens.root })
				.expect(400)
		})

		test('...title and url', async () => {
			await api
				.post('/api/blogs')
				.send({
					author: 'Robert C. Martin',
					likes: 10
				})
				.set({ Authorization: userTokens.root })
				.expect(400)
		})
	})
	describe('401 unauthorized when...', () => {
		test('...no authorization header', async () => {
			const newBlog = {
				title: 'First class tests',
				author: 'Robert C. Martin',
				url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.html',
				likes: 10
			}

			await api
				.post('/api/blogs')
				.send(newBlog)
				.expect(401)
				.expect('Content-Type', /application\/json/)
		})

		test('...invalid authorization header', async () => {
			const newBlog = {
				title: 'First class tests',
				author: 'Robert C. Martin',
				url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.html',
				likes: 10
			}

			await api
				.post('/api/blogs')
				.send(newBlog)
				.set({ Authorization: 'bearer aaeevvvvv' })
				.expect(401)
				.expect('Content-Type', /application\/json/)
		})
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
		const toDeleteBlog = await Blog.findOne({ title: 'React Patterns' })
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
			.send({ likes: 0 })
			.expect(400)
	})

	test('sending valid but not present id gives 404 Not Found', async () => {
		const toDeleteId = new mongoose.Types.ObjectId()

		await api
			.put(`/api/blogs/${toDeleteId}`)
			.send({ likes: 1 })
			.expect(404)
	})

	test('updating only likes of an element', async () => {
		const toUpdateBlog = (await Blog.findOne({ title: 'React Patterns' })).toJSON()

		await api
			.put(`/api/blogs/${toUpdateBlog.id}`)
			.send({ likes: 200 })
			.expect(200)

		const updatedBlog = (await Blog.findOne({ title: 'React Patterns' })).toJSON()
		expect(updatedBlog).toEqual({ ...toUpdateBlog, likes: 200 })
	})

	test('updating all properties of an element', async () => {
		const toUpdateBlog = (await Blog.findOne({ title: 'React Patterns' })).toJSON()

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
		expect(updatedBlog).toEqual({ ...toUpdateBlog, title: 'title', author: 'author', url: 'url', likes: 100 })
	})
})

afterAll(async () => {
	await mongoose.connection.close()
})
