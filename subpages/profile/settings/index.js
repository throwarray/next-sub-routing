import React, { Component } from 'react'

import Error from 'next/error'

import dynamic from 'next/dynamic'

import parseSubpath, { getInitialProps } from '../../../lib/subpage.js'

import { parse } from 'url'

const indexPage =()=> <div>SETTINGS PLACEHOLDER</div>

const Components = Object.assign(Object.create(null), {
	['']: indexPage,
	['/']: indexPage,
	['/index']: indexPage,
	['/account']: dynamic(()=> import('./account/index.js'))
})

export default class extends Component {
	static async getInitialProps (ctx) {
		let meta, pageProps
		let Component

		const routerMount = '/profile'
		const parsed = parse(ctx.asPath)
		const pathname = parsed.pathname

		meta = parseSubpath(
			pathname === routerMount ? pathname: '/profile/settings',
			parsed,
			ctx.query
		)

		Component = Components[meta.page]

		if (Component) {
			if (meta.fromQuery)
				meta.query.id = meta.query.id.substr(meta.page.length)

			pageProps = await getInitialProps(
				Component, { ...ctx }
			)
		}

		return {
			pageName: meta.page || '',
			pageProps: pageProps || {}
		}
	}

	render () {
		const { pageName, pageProps, ...props } = this.props

		const Component = Components[pageName]

		return !Component?
			<Error statusCode={ 404 }/> :
			<Component {...pageProps} { ...props }/>
	}
}
