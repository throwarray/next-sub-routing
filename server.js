const next = require('next')
const express = require('express')
const port = parseInt(process.env.PORT, 10) || 3000

const app = next({ dev: true })

const handle = app.getRequestHandler()

const { parse, format } = require('url')

setImmediate(function () {
	console.log('> Preparing server.')

	app.prepare().then(() => {
		const server = express()

		const dirPosts = /^\/profile/

		server.get('/profile/*+', function (req, res) {
			const parsed = parse(req.url, true)
			const redirect = parsed.pathname.replace(dirPosts, '')

			res.redirect(format({
				pathname: '/profile',
				query: { ...parsed.query, id: redirect }
			}))
		})

		server.get('*', (req, res) => {
			return handle(req, res)
		})

		server.listen(port, (err) => {
			if (err) throw err

			console.log(`> Ready on http://localhost:${port}`)
		})
	})
})
