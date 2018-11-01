import React, { Component } from 'react'

import dynamic from 'next/dynamic'

import Error from 'next/error'

import { handleSubroute } from '../lib/subpage.js'

import Link from 'next/link'

const indexPage = ()=> <div>PROFILE PLACEHOLDER</div>

const Components = Object.assign(Object.create(null), {
	['']: indexPage,
	['/']: indexPage,
	['/index']: indexPage,
	['/settings']: dynamic(()=> import('../subpages/profile/settings/index.js'))
})

const Nav = ()=> {
	return <aside>
		<style jsx>{`
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
}

export default class extends Component {
	static async getInitialProps (ctx) {
		return await handleSubroute(
			Components,
			'/profile',
			'/profile',
			ctx
		)
	}

	render () {
		const { pageName, pageProps, ...props } = this.props

		const Component = Components[pageName]

		return <div>
			<style jsx>{`
				div {
					display: flex;
					flex: 1;
				}
			`}
			</style>
			<Nav/>
			{
				!Component &&
					<Error statusCode={ 404 }/> ||
					<Component {...pageProps} { ...props }/>
			}
		</div>
	}
}
