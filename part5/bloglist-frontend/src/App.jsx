import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'

import './index.css'

const App = () => {
	const [blogs, setBlogs] = useState([])

	const [username, setUsername] = useState('')
	const [password, setPassword] = useState('')
	const [user, setUser] = useState(null)

	const [title, setTitle] = useState('')
	const [author, setAuthor] = useState('')
	const [url, setUrl] = useState('')

	const [notifError, setNotifError] = useState(null)
	const [notifSuccess, setNotifSuccess] = useState(null)

	useEffect(() => {
		blogService.getAll().then(blogs =>
			setBlogs( blogs )
		)
	}, [])

	useEffect(() => {
		const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
		if (loggedUserJSON) {
			const user = JSON.parse(loggedUserJSON)
			setUser(user)
			blogService.setToken(user.token)
		}
	}, [])

	const displayNotification = (type, message) => {
		const timeout = 4000
		if (type === 'success') {
			setNotifSuccess(message)
			setTimeout(() => {
				setNotifSuccess(null)
			}, timeout)
		} else if (type === 'error') {
			setNotifError(message)
			setTimeout(() => {
				setNotifError(null)
			}, timeout)
		} else {
			console.error(`invalid notification type ${type}`)
		}
	}

	const handleLogin = async (event) => {
		event.preventDefault()

		try {
			const user = await loginService.login({
				username, password,
			})

			window.localStorage.setItem(
				'loggedBlogappUser', JSON.stringify(user)
			)
			blogService.setToken(user.token)
			setUser(user)
			setUsername('')
			setPassword('')
			displayNotification('success', `logged in as ${user.username}`)
		} catch (e) {
			console.error(e)
			displayNotification('error', e.response.data.error)
		}
	}

	const handleLogout = (event) => {
		event.preventDefault()

		blogService.setToken(null)
		window.localStorage.removeItem('loggedBlogappUser')
		setUser(null)
		displayNotification('success', 'logged out')
	}

	const handleCreateBlog = async (event) => {
		event.preventDefault()

		try {
			const newBlog = {
				title: title,
				author: author,
				url: url
			}

			const createdBlog = await blogService.create(newBlog)
			setBlogs(blogs.concat(createdBlog))
			displayNotification('success', `a new blog ${newBlog.title} by ${newBlog.author} added`)
		} catch (e) {
			console.error(e)
			displayNotification('error', e.response.data.error)
		}
	}

	const notification = () => (
		<div className={notifError ? 'notifError' : 'notifSuccess'}>
			{notifError || notifSuccess}
		</div>
	)

	const loginForm = () => (
		<>
			<form onSubmit={handleLogin}>
				<div>
					username
					<input
						type='text'
						value={username}
						name='Username'
						onChange={({ target }) => setUsername(target.value)}
					/>
				</div>
				<div>
					password
					<input
						type='password'
						value={password}
						name='Password'
						onChange={({ target }) => setPassword(target.value)}
					/>
				</div>
				<button type='submit'>login</button>
			</form>
		</>
	)

	const blogList = () => (
		<>
			<div>
				{user.username} logged in
				<button onClick={handleLogout}>logout</button>
			</div>
			<br/>
			<div>
				<h2>create new</h2>
				<form onSubmit={handleCreateBlog}>
					<div>
						title:
						<input
							type='text'
							value={title}
							name='Title'
							onChange={({ target }) => setTitle(target.value)}
						/>
					</div>
					<div>
						author:
						<input
							type='text'
							value={author}
							name='Author'
							onChange={({ target }) => setAuthor(target.value)}
						/>
					</div>
					<div>
						url:
						<input
							type='text'
							value={url}
							name='Url'
							onChange={({ target }) => setUrl(target.value)}
						/>
					</div>
					<button type='submit'>create</button>
				</form>
			</div>
			<br/>
			<div>
				{blogs.map(blog =>
					<Blog key={blog.id} blog={blog} />
				)}
			</div>
		</>
	)

	return (
		<div>
			<h2>{!user ? 'log in to application' : 'blogs'}</h2>
			{notifError || notifSuccess
				? notification()
				: <></>}
			{!user
				? loginForm()
				: blogList()
			}
		</div>
	)
}

export default App
