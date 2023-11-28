
const NewBlogForm = ({
	handleCreateBlog,
	handleTitleChange,
	handleAuthorChange,
	handleUrlChange,
	title,
	author,
	url
}) => {
	return (
		<div>
			<h2>create new</h2>
			<form onSubmit={handleCreateBlog}>
				<div>
					title:
					<input
						type='text'
						value={title}
						name='Title'
						placeholder='title'
						onChange={handleTitleChange}
					/>
				</div>
				<div>
					author:
					<input
						type='text'
						value={author}
						name='Author'
						placeholder='author'
						onChange={handleAuthorChange}
					/>
				</div>
				<div>
					url:
					<input
						type='text'
						value={url}
						name='Url'
						placeholder='url'
						onChange={handleUrlChange}
					/>
				</div>
				<button type='submit'>create</button>
			</form>
		</div>
	)
}

export default NewBlogForm
