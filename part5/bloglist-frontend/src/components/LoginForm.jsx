const LoginForm = ({
	handleLogin,
	handleUsernameChange,
	handlePasswordChange,
	username,
	password
}) => (
	<form onSubmit={handleLogin}>
		<div>
			username
			<input
				type='text'
				id='username'
				value={username}
				name='Username'
				onChange={handleUsernameChange}
			/>
		</div>
		<div>
			password
			<input
				type='password'
				id='password'
				value={password}
				name='Password'
				onChange={handlePasswordChange}
			/>
		</div>
		<button type='submit' id='login-button'>login</button>
	</form>
)

export default LoginForm
