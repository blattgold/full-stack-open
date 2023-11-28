import Blog from './Blog'

const BlogList = ({
	blogs,
	makeHandleLikeButton,
	makeHandleRemoveButton,
	username
}) => {
	return (
		<div>
			{blogs.map(blog =>
				<Blog
					key={blog.id}
					blog={blog}
					makeHandleLikeButton={makeHandleLikeButton}
					makeHandleRemoveButton={makeHandleRemoveButton}
					username={username}
				/>
			)}
		</div>
	)
}

export default BlogList
