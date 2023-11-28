import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import NewBlogForm from './NewBlogForm'

test('calls event handler with right details', async () => {
	const mockHandler = jest.fn()
	const user = userEvent.setup()

	let title = ''
	let author = ''
	let url = ''

	const mockHandlerWrapper = (event) => {
		event.preventDefault()

		const newBlog = {
			title: title,
			author: author,
			url: url
		}
		mockHandler(newBlog)
	}

	const { container } = render(
		<NewBlogForm
			handleCreateBlog={ mockHandlerWrapper }
			handleTitleChange={({ target })=> title += target.value}
			handleAuthorChange={({ target }) => author += target.value}
			handleUrlChange={({ target }) => url += target.value}
			title={title}
			author={author}
			url={url}
		/>
	)

	const titleInput = screen.getByPlaceholderText('title')
	const authorInput = screen.getByPlaceholderText('author')
	const urlInput = screen.getByPlaceholderText('url')

	await user.type(titleInput, 'testTitle')
	await user.type(authorInput, 'testAuthor')
	await user.type(urlInput, 'testUrl')

	const submitButton = screen.getByText('create')
	await user.click(submitButton)


	expect(mockHandler.mock.calls).toHaveLength(1)
	console.log(mockHandler.mock.calls[0])
	expect(mockHandler.mock.calls[0][0]).toEqual({
		title: 'testTitle',
		author: 'testAuthor',
		url: 'testUrl'
	})
})
