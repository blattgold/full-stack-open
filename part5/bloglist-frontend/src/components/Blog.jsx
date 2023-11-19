import { useState } from 'react'

const Blog = ({ blog }) => {
	const [visible, setVisible] = useState(false)

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
					<button>like</button>
				</div>
				<div>{blog.user.username}</div>
			</div>
		</div>
	)
}

export default Blog
