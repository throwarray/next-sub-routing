import React, { Component } from 'react'

import dynamic from 'next/dynamic'

import Error from 'next/error'

import parseSubpath, { getInitialProps } from '../lib/subpage.js'

import Link from 'next/link'

const indexPage = ()=> <div>
	[PROFILE INDEX]
	Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
</div>

const Components = Object.assign(Object.create(null), {
	['']: indexPage,
	['/']: indexPage,
	['/index']: indexPage,
	['/settings']: dynamic(
		()=> import('../subpages/profile/settings/index.js'),
		{ loading: <span></span> }
	)
})



export default class extends Component {
	static async getInitialProps (ctx) {
		let meta
		let pageProps
		let Component

		meta = parseSubpath('profile', ctx.asPath)

		Component = Components[meta.page]

		if (Component) {
			if (meta.fromQuery)
				meta.query.id = meta.query.id.substr(meta.page.length)

			pageProps = await getInitialProps(Component, {
				 ...ctx,
				 query: meta.query
			})
		}

		return {
			pageName: meta.page || '',
			pageProps: pageProps || {}
		}
	}
	render () {
		const { pageName, pageProps, ...props } = this.props

		const Component = Components[pageName]

		return <div className="sub">
			<style jsx>{`
				.sub {
					display: flex;
					flex: 1;
				}
				aside {
					padding: 1em;
					background: #555;
				}
				aside a {
					color: #fff;
					display: block;
					margin: 0.5em;
					width: 120px;
				}
			`}
			</style>
			<aside>
			<Link href={{ pathname: '/profile' }}>
				<a>Profile</a>
			</Link>
			<Link
				href={{ pathname: '/profile', query: { id: 'settings' }}}
				as='/profile/settings'
			>
				<a>Settings</a>
			</Link>
			<Link
				href={{ pathname: '/profile', query: { id: 'settings/account' }}}
				as='/profile/settings/account'
			>
				<a>Account Settings</a>
			</Link>
			</aside>
			{
				!Component && <Error statusCode={ 404 }/> ||
				<Component {...pageProps} { ...props }/>
			}
		</div>
	}
}
