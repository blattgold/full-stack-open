import Blog from './Blog'

const BlogList = ({
	blogs,
	makeHandleLikeButton,
	username
}) => {
	return (
		<div>
			{blogs.map(blog =>
				<Blog
					key={blog.id}
					blog={blog}
					makeHandleLikeButton={makeHandleLikeButton}
					username={username}
				/>
			)}
		</div>
	)
}

export default BlogList
