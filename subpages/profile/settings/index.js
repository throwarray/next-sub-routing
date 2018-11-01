import React, { Component } from 'react'

import Error from 'next/error'

import dynamic from 'next/dynamic'

import { handleSubroute } from '../../../lib/subpage.js'

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
		return await handleSubroute(
			Components,
			'/profile',
			'/profile/settings',
			ctx
		)
	}

	render () {
		const { pageName, pageProps, ...props } = this.props

		const Component = Components[pageName]

		return !Component?
			<Error statusCode={ 404 }/> :
			<Component {...pageProps} { ...props }/>
	}
}
