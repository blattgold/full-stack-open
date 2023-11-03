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

module.exports = {
	dummy,
	totalLikes,
	favoriteBlog
}
