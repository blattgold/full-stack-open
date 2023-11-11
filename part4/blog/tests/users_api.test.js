const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const User = require('../models/user')

beforeEach(async () => {
	await User.deleteMany({})
	const user = new User({
		_id: '654fcddbc7d0a708056dc651',
		username: 'admin',
		name: '',
		passwordHash: '$2b$10$5Y0uN3SHQShB1BvecX25vuTtPaQtdwLSF8WY3aqQce79Riy6W0eu2',
		blogs: [],
		__v: 0
	})
	await user.save()
})

describe('POST /api/users', () => {
	test('valid data provided', async () => {
		const user = { username: 'user', name: 'name', password: 'password' }

		await api
			.post('/api/users')
			.send(user)
			.expect(201)
			.expect('Content-Type', /application\/json/)

		const dbUsers = await User.find({})
		expect(dbUsers.length).toBe(2)

		const dbUser = await User.findOne({ username: 'user' })
		expect(dbUser).toBeTruthy()
		expect(dbUser.username).toBe('user')
		expect(dbUser.name).toBe('name')
		expect(dbUser.blogs).toEqual([])
	})

	test('no name should create a blank name', async () => {
		const user = { username: 'user', password: 'password' }

		await api
			.post('/api/users')
			.send(user)
			.expect(201)
			.expect('Content-Type', /application\/json/)

		const dbUser = await User.findOne({ username: 'user' })
		expect(dbUser).toBeTruthy()
		expect(dbUser.name).toBe('')
	})

	test('no username', async () => {
		const user = { password: 'password' }

		const response = await api
			.post('/api/users')
			.send(user)
			.expect(400)
			.expect('Content-Type', /application\/json/)

		expect(response.body).toEqual({ error: 'User validation failed: username: no username provided' })
	})

	test('no password', async () => {
		const user = { username: 'username' }

		const response = await api
			.post('/api/users')
			.send(user)
			.expect(400)
			.expect('Content-Type', /application\/json/)

		expect(response.body).toEqual({ error: 'no password provided' })
	})

	test('username with less than 3 chars', async () => {
		const user = { username: 'us', password: 'password' }

		const response = await api
			.post('/api/users')
			.send(user)
			.expect(400)
			.expect('Content-Type', /application\/json/)

		expect(response.body).toEqual({ error: 'User validation failed: username: username must be 3 characters or more' })
	})

	test('password with less than 3 chars', async () => {
		const user = { username: 'username', password: 'pa' }

		const response = await api
			.post('/api/users')
			.send(user)
			.expect(400)
			.expect('Content-Type', /application\/json/)

		expect(response.body).toEqual({ error: 'password must be 3 characters or more' })
	})

	test('non unique username', async () => {
		const user = { username: 'admin', password: 'password' }

		const response = await api
			.post('/api/users')
			.send(user)
			.expect(400)
			.expect('Content-Type', /application\/json/)

		expect(response.body).toEqual({ error: 'E11000 duplicate key error collection: test_blogs_app.users index: username_1 dup key: { username: \"admin\" }' })
	})
})
