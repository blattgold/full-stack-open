import { useState } from 'react'
import blogService from '../services/blogs'

const Blog = ({ blog, makeHandleLikeButton, username }) => {
	const [visible, setVisible] = useState(false)

	const handleRemoveButton = (event) => {
		event.preventDefault()

		if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)){
			setBlogs(blogs.filter(savedBlog => savedBlog.id !== blog.id))
			blogService.remove(blog.id)
		}
	}

	const blogStyle = {
		paddingTop: 10,
		paddingLeft: 2,
		border: 'solid',
		borderWidth: 1,
		marginBottom: 5
	}

	return (
		<div style={blogStyle}>
			<div className='titleAndAuthor'>
				{blog.title} {blog.author}
				<button onClick={() => setVisible(!visible)}>
					{visible ? 'hide' : 'view'}
				</button>
			</div>
			<div className='urlAndLikes' style={{ display: visible ? '' : 'none' }}>
				<div>
					<a href={blog.url}>
						{blog.url}
					</a>
				</div>
				<div>
					likes {blog.likes}
					<button onClick={makeHandleLikeButton(blog)}>like</button>
				</div>
				<div>{blog.user.username}</div>
				<div style={{ display: username === blog.user.username ? '' : 'none' }}>
					<button onClick={handleRemoveButton}>remove</button>
				</div>
			</div>
		</div>
	)
}

export default Blog
