const dummy = blogs => {
	// this gives an unused variable error with eslint but I'll keep it because the exercise says to do this
	return 1
}

const totalLikes = blogs => {
	return blogs.reduce(
		(acc, blog) => acc + blog.likes,
		0
	)
}

module.exports = {
	dummy,
	totalLikes
}
