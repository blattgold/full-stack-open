const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
	const blogs = await Blog.find({}).populate('user', {
		username: 1,
		name: 1
	})
	response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
	const blog = new Blog(request.body)

	const user = request.user
	if (!user)
		return response.status(401).json({ error: 'no token provided' })

	blog.user = user._id

	if (!blog.title || !blog.url)
		return response.status(400).json({ error: 'title and / or url missing' })
	if (!blog.likes)
		blog.likes = 0

	const result = await blog.save()

	user.blogs.push(result._id)
	await user.save()

	response.status(201).json(await result.populate('user', {
		username: 1,
		name: 1
	}))
})

blogsRouter.delete('/:id', async (request, response) => {
	const id = request.params.id
	const user = request.user
	if (!user)
		return response.status(401).json({ error: 'no token provided' })

	const blogToDelete = await Blog.findById(id)
	if (!blogToDelete)
		return response.status(404).json({ error: 'no blog with given id' })

	if (user.id.toString() !== blogToDelete.user.toString())
		return response.status(401).json({ error: 'you can only delete a blog which you created' })

	await Blog.findByIdAndDelete(id)
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
