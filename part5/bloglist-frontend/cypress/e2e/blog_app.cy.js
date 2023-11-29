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

		describe('User can...', function() {
			beforeEach(function() {
				cy.request({
					url: 'http://localhost:3003/api/blogs',
					method: 'POST',
					body: {
						title: 'testTitle', 
						author: 'testAuthor',
						url: 'testUrl'
					},
					headers: {
						'Authorization': `bearer ${JSON.parse(localStorage.getItem('loggedBlogappUser')).token}`
					}
				})
				cy.visit('http://localhost:5173')
			})

			it('User can like a blog', function() {
				cy.contains('view').click()
				cy.contains('likes 0')
				cy.contains('like').click()
				cy.contains('likes 1')
			})

			it('User can delete a blog', function() {
				cy.contains('view').click()
				cy.contains('remove').click()
				cy.contains('Removed blog testTitle by testAuthor')
				cy.contains('testTitle testAuthor').should('not.exist')
			})

			describe('Ensure only user who created blog can see delete button', function() {
				beforeEach(function() {
					localStorage.removeItem('loggedBlogappUser')

					cy.request('POST', 'http://localhost:3003/api/users', {
						username: 'anotheruser',
						password: 'anotherpass'
					})
					cy.request('POST', 'http://localhost:3003/api/login', {
						username: 'anotheruser',
						password: 'anotherpass'
					}).then(response => {
						localStorage.setItem('loggedBlogappUser', JSON.stringify(response.body))
						cy.visit('http://localhost:5173')
					})
				})

				it('Ensure only user who created blog can see delete button', function() {
					cy.contains('view').click()
					cy.contains('remove').parent().should('have.css', 'display', 'none')
				})
			})
		})
	})
})
