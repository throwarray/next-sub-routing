import React, { Component, Fragment } from 'react'

import Error from 'next/error'

import { handleSubroute } from '../../../../lib/subpage.js'

import Link from 'next/link'

const Nav = ()=> {
	return <header>
		<style jsx>{`
			div {
				color: #fff;
			}
			a {
				margin: 0.5em;
			}
		`}
		</style>
		<Link href="/profile?id=settings%2Faccount" as="/profile/settings/account">
			<a>Account Home</a>
		</Link>
		<Link href="/profile?id=settings%2Faccount%2Ffoo" as="/profile/settings/account/foo">
			<a>Foo Page</a>
		</Link>
		<Link href="/profile?id=settings%2Faccount%2Fbar" as="/profile/settings/account/bar">
			<a>Bar Page</a>
		</Link>
	</header>
}

const indexPage =()=> <div>Account home</div>

const Components = Object.assign(Object.create(null), {
	['']: indexPage,
	['/']: indexPage,
	['/index']: indexPage,
	['/foo']: ()=> <div>Account / Foo</div>,
	['/bar']: ()=> <div>Account / Bar</div>
})

export default class extends Component {
	static async getInitialProps (ctx) {
		return await handleSubroute(
			Components,
			'/profile',
			'/profile/settings/account',
			ctx
		)
	}

	render () {
		const { pageName, pageProps, ...props } = this.props

		const Component = Components[pageName]

		return <Fragment>
			<div style={{ flex: 1 }}>
				<Nav/>
				{
					!Component?
						<Error statusCode={ 404 }/> :
						<Component {...pageProps} { ...props }/>
				}
			</div>
		</Fragment>
	}
}
