import { useState } from 'react'
import blogService from '../services/blogs'

const Blog = ({
	blog,
	makeHandleLikeButton,
	makeHandleRemoveButton,
	username
}) => {
	const [visible, setVisible] = useState(false)

	const blogStyle = {
		paddingTop: 10,
		paddingLeft: 2,
		border: 'solid',
		borderWidth: 1,
		marginBottom: 5
	}

	return (
		<div style={blogStyle} className='blog'>
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
					<button onClick={makeHandleRemoveButton(blog)}>remove</button>
				</div>
			</div>
		</div>
	)
}

export default Blog
