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

	describe('When logged in', function() {
		beforeEach(function() {
			cy.request('POST', 'http://localhost:3003/api/users', {
				username: 'testuser',
				password: 'testpass'
			})
			cy.request('POST', 'http://localhost:3003/api/login', {
				username: 'testuser',
				password: 'testpass'
			}).then(response => {
				localStorage.setItem('loggedBlogappUser', JSON.stringify(response.body))
				cy.visit('http://localhost:5173')
			})
		})

		it('A blog can be created', function() {
			cy.contains('create new blog').click()
			cy.get('input[placeholder="title"]').type('testTitle')
			cy.get('input[placeholder="author"]').type('testAuthor')
			cy.get('input[placeholder="url"]').type('testUrl')
			cy.get('#create-blog-button').click()

			cy.contains('new blog testTitle by testAuthor added')
			cy.contains('testTitle testAuthor')
				.contains('view')
		})

		it.only('User can like a blog', function() {
			cy.contains('create new blog').click()
			cy.get('input[placeholder="title"]').type('testTitle')
			cy.get('input[placeholder="author"]').type('testAuthor')
			cy.get('input[placeholder="url"]').type('testUrl')
			cy.get('#create-blog-button').click()

			cy.contains('view').click()
			cy.contains('likes 0')
			cy.contains('like').click()
			cy.contains('likes 1')
		})
	})
})
