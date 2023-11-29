describe('Blog app', function() {
	beforeEach(function() {
		cy.request('POST', 'http://localhost:3003/api/testing/reset')
		cy.visit('http://localhost:5173')
	})

	it('Login form is shown', function() {
		cy.contains('log in to application')
		cy.contains('username')
		cy.contains('password')
		cy.contains('login')
	})

	describe('Login', function() {
		beforeEach(function() {
			cy.request('POST', 'http://localhost:3003/api/users', {
				username: 'testuser',
				password: 'testpass'
			})
		})

		it('succeeds with correct credentials', function() {
			cy.get('#username').type('testuser')
			cy.get('#password').type('testpass')
			cy.get('#login-button').click()

			cy.contains('logged in as testuser')
		})

		it('fails with wrong credentials', function() {
			cy.get('#username').type('testuser')
			cy.get('#password').type('password')
			cy.get('#login-button').click()

			cy.contains('invalid username or password')
		})
	})
})
