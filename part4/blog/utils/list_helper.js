const lodash = require('lodash')

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

const favoriteBlog = blogs => {
	// returns the blog with most likes
	if (blogs.length === 0) {
		return null
	} else {
		return blogs.reduce(
			(acc, blog) => blog.likes > acc.likes
				? {title: blog.title, author: blog.author, likes: blog.likes}
				: acc,
			{likes: -1}
		)
	}
}

const mostBlogs = blogs => {
	// returns the Author with the most blogs and how many that is
	if (blogs.length === 0) {
		return null
	} else {
		const counts = lodash.countBy(
			blogs,
			blog => blog.author
		)
		return Object.keys(counts).reduce(
			(acc, key) => counts[key] > acc.blogs
				? {author: key, blogs: counts[key]}
				: acc,
			{author: '', blogs: -1}
		)
	}
}

module.exports = {
	dummy,
	totalLikes,
	favoriteBlog,
	mostBlogs
}
