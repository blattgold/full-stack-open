const logger = require('./logger')
const jwt = require('jsonwebtoken')
const User = require('../models/user')

const tokenExtractor = (request, response, next) => {
	const authorization = request.get('authorization')
	if (authorization && authorization.startsWith('bearer ')) {
		request.token = authorization.replace('bearer ', '')
	}
	next()
}

const userExtractor = async (request, response, next) => {
	let decodedToken = null

	if (request.token) {
		try {
			decodedToken = jwt.verify(request.token, process.env.SECRET)
		} catch(e) {
			return next(e)
		}
	}

	if (decodedToken && decodedToken.id)
		request.user = await User.findById(decodedToken.id)

	next()
}

const errorHandler = (error, request, response, next) => {
	logger.error(error.message)

	if (error.name === 'CastError') {
		return response.status(400).send({ error: 'malformatted id' })
	} else if (error.name === 'ValidationError') {
		return response.status(400).send({ error: error.message })
	} else if (error.name === 'MongoServerError') {
		return response.status(400).send({ error: error.message })
	} else if (error.name === 'JsonWebTokenError') {
		return response.status(401).json({ error: error.message })
	}

	next(error)
}

module.exports = {
	tokenExtractor,
	userExtractor,
	errorHandler
}
