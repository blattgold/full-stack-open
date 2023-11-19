import { useState } from 'react'
import blogService from '../services/blogs'

const Blog = ({ blog, blogs, setBlogs }) => {
	const [visible, setVisible] = useState(false)

	const handleLikeButton = (event) => {
		event.preventDefault()

		const updatedBlog = {
			user: blog.user.id,
			likes: blog.likes + 1,
			author: blog.author,
			title: blog.title,
			url: blog.url
		}	
		let savedBlogs = [...blogs]
		savedBlogs.find(blogSaved => blogSaved.id === blog.id).likes += 1
		savedBlogs.sort((a, b) => {
			if (a.likes > b.likes) {
				return -1
			} else if (b.likes > a.likes) {
				return 1
			} else {
				return 0
			}
		})
		setBlogs(savedBlogs)

		blogService.update(blog.id, updatedBlog)
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
			<div>
				{blog.title} {blog.author}
				<button onClick={() => setVisible(!visible)}>
					{visible ? 'hide' : 'view'}
				</button>
			</div>
			<div style={{display: visible ? '' : 'none'}}>
				<div>
					<a href={blog.url}>
						{blog.url}
					</a>
				</div>
				<div>
					likes {blog.likes}
					<button onClick={handleLikeButton}>like</button>
				</div>
				<div>{blog.user.username}</div>
			</div>
		</div>
	)
}

export default Blog
