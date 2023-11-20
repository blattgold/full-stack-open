import Blog from './Blog'

const BlogList = ({
	blogs,
	setBlogs,
	username
}) => {
	return (
		<div>
			{blogs.map(blog =>
				<Blog
					key={blog.id}
					blog={blog}
					blogs={blogs}
					setBlogs={setBlogs}
					username={username}
				/>
			)}
		</div>
	)
}

export default BlogList
