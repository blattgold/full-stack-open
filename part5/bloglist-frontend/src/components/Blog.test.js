import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

const blog = {
	id: '654fcddbc7d0a708056dc651',
	user: '6550fa108d1c4d7701c9ef55',
	title: 'testTitle',
	url: 'http://test.com',
	author: 'testAuthor',
	likes: 12
}

test('renders title and author but not url or likes', () => {
	const { container } = render(<Blog blog={blog} makeHandleLikeButton={() => null}/>)

	const div1 = container.querySelector('.titleAndAuthor')
	expect(div1).toHaveTextContent('testTitle testAuthor')

	const div2 = container.querySelector('.urlAndLikes')
	expect(div2).toHaveStyle('display: none')
})

test('renders url and likes when button clicked', async () => {
	const { container } = render(<Blog blog={blog} makeHandleLikeButton={() => null}/>)

	const user = userEvent.setup()
	const button = screen.getByText('view')
	await user.click(button)

	const div = container.querySelector('.urlAndLikes')
	expect(div).not.toHaveStyle('display: none')
})

test('like button clicked correct no. of times', async () => {
	const mockHandler = jest.fn()
	render(<Blog blog={blog} makeHandleLikeButton={mockHandler}/>)

	const user = userEvent.setup()

	const viewButton = screen.getByText('view')
	const likeButton = screen.getByText('like')

	await user.click(viewButton)
	await user.click(likeButton)
	await user.click(likeButton)

	expect(mockHandler.mock.calls).toHaveLength(2)
})
