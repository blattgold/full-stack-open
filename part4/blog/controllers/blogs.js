const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
	const blogs = await Blog.find({})
	response.json(blogs)
})

blogsRouter.delete('/:id', async (request, response, next) => {
	const id = request.params.id
	try {
		await Blog.findByIdAndDelete(id)
	} catch(exception) {
		next(exception)
	}

	response.status(204).end()
})

blogsRouter.post('/', async (request, response) => {
	const blog = new Blog(request.body)

	if (!blog.title || !blog.url) return response.status(400).end()
	if (!blog.likes) blog.likes = 0

	const result = await blog.save()
	response.status(201).json(result)
})

module.exports = blogsRouter
