import React from 'react'
import Link from 'next/link'
import App, { Container } from 'next/app'

const Header = ({ title })=> {
	return <header>
		<style jsx>{`
			header {
				background: #222;
				color: white;
				padding: 1em;
			}
			a {
				color: white;
				padding: 0.5em;
			}
		`}</style>
		<h2>
			<Link href={{ pathname: '/' }}>
				<a>{title}</a>
			</Link>
		</h2>
		<Link href={{ pathname: '/' }}>
			<a>Home</a>
		</Link>
		<Link
			href={{ pathname: '/profile', query: { id: '' }}}
			as='/profile'
		>
			<a>Profile</a>
		</Link>
	</header>
}

export default class MyApp extends App {
	static async getInitialProps({ Component, /* router,*/ ctx }) {
		let pageProps = {}

		if (Component.getInitialProps) {
			pageProps = await Component.getInitialProps(ctx)
		}

		return { pageProps }
	}

	render () {
		const { Component, pageProps } = this.props

		return (
			<Container>
				<style global jsx>{`
					body {
						margin: 0;
						min-height: 100vh;
					}
					#__next {
						min-height: inherit;
						display: flex;
						flex-direction: column;
					}
					.page {
						flex: 1;
						display: flex;
					}
				`}
				</style>
				<Header title={ 'Navigation'} />
				<div className="page">
					<Component {...pageProps} />
				</div>
			</Container>
		)
	}
}
