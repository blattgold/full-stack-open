import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import Blog from './Blog'

test('renders title and author but not url or likes', () => {
	const blog = {
		id: '654fcddbc7d0a708056dc651',
		user: '6550fa108d1c4d7701c9ef55',
		title: 'testTitle',
		url: 'http://test.com',
		author: 'testAuthor',
		likes: 12
	}

	const {container} = render(<Blog blog={blog} />)

	const div1 = container.querySelector('.titleAndAuthor')
	expect(div1).toHaveTextContent('testTitle testAuthor')

	const div2 = container.querySelector('.urlAndLikes')
	expect(div2).toHaveStyle('display: none')
})
