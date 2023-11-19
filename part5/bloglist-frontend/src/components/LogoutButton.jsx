const LogoutButton = ({ 
	handleLogout,
	username
}) => (
	<div>
		logged in as {username}
		<button onClick={handleLogout}>logout</button>
	</div>
)

export default LogoutButton
