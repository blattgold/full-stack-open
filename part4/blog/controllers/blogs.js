const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
	const blogs = await Blog.find({})
	response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
	const blog = new Blog(request.body)

	if (!blog.title || !blog.url) return response.status(400).end()
	if (!blog.likes) blog.likes = 0

	const result = await blog.save()
	response.status(201).json(result)
})

blogsRouter.delete('/:id', async (request, response, next) => {
	const id = request.params.id
	try {
		await Blog.findByIdAndDelete(id)
	} catch(error) {
		next(error)
	}

	response.status(204).end()
})

blogsRouter.put('/:id', async (request, response, next) => {
	const body = request.body
	const blog = {}
	
	if (body.title) blog.title = body.title
	if (body.author) blog.author = body.author
	if (body.url) blog.url = body.url
	if (body.likes) blog.likes = body.likes

	try {
		const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })

		if (updatedBlog) response.status(200).json(updatedBlog)
		else response.status(404).end()
	} catch(error) {
		next(error)
	}

})

module.exports = blogsRouter
