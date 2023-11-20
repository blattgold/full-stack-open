import { useState, useEffect, useRef } from 'react'

import Blog from './components/Blog'
import BlogList from './components/BlogList'
import NewBlogForm from './components/NewBlogForm'
import LoginForm from './components/LoginForm'
import LogoutButton from './components/LogoutButton'
import Togglable from './components/Togglable'

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
			setBlogs( blogs.sort((a, b) => {
				if (a.likes > b.likes) {
					return -1
				} else if (b.likes > a.likes) {
					return 1
				} else {
					return 0
				}
			}))
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

	const newBlogFormRef = useRef()

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

			setTitle('')
			setAuthor('')
			setUrl('')
			newBlogFormRef.current.toggleVisibility()
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

	const handleUsernameChange = ({ target }) => setUsername(target.value)
	const handlePasswordChange = ({ target }) => setPassword(target.value)
	const handleTitleChange = ({ target }) => setTitle(target.value)
	const handleAuthorChange = ({ target }) => setAuthor(target.value)
	const handleUrlChange = ({ target }) => setUrl(target.value)

	return (
		<div>
			<h2>{!user ? 'log in to application' : 'blogs'}</h2>
			{notifError || notifSuccess
				? notification()
				: <></>
			}
			{!user
				? <LoginForm
					handleLogin={handleLogin}
					handleUsernameChange={handleUsernameChange}
					handlePasswordChange={handlePasswordChange}
					username={username}
					password={password}
				/>
				: (
					<>
						<LogoutButton
							handleLogout={handleLogout}
							username={user.username}
						/>
						<Togglable buttonLabel='create new blog' ref={newBlogFormRef}>
							<NewBlogForm
								handleCreateBlog={handleCreateBlog}
								handleTitleChange={handleTitleChange}
								handleAuthorChange={handleAuthorChange}
								handleUrlChange={handleUrlChange}
								title={title}
								author={author}
								url={url}
							/>
						</Togglable>
						<BlogList
							blogs={blogs}
							setBlogs={setBlogs}
							username={user ? user.username : null}
						/>
					</>
				)
			}
		</div>
	)
}

export default App
