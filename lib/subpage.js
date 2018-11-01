import { parse } from 'url'

const leadSlash = /^\//
const trailSlash = /\/$/
const hasOwn = Object.prototype.hasOwnProperty

function pageFromQuery (query, keyName = 'id') {
	let page = ''
	let prop = query[keyName] || ''

	if (!prop) page = ''
	else if (prop === '/') page = '/'
	else {
		const props = prop.split('/')
		page = '/' + (props[0] || props[1] || '')
	}

	return page
}

function x_parseSub (mountPath, pathname) {
	let page = pathname
		.substr((mountPath + '/').length - 1)
		.replace(leadSlash, '')
		.split('/')[0]
	return page
}

// FIXME Use capture groups
export default function parseSubpath (mount = '', input, query) {
	const urlObj = typeof input === 'object'? input: parse(input, true)
	const mountPath = mount.replace(leadSlash, '').replace(trailSlash, '')
	const pathname = urlObj.pathname? urlObj.pathname.replace(leadSlash, '') : ''
	const endsWithSlash = pathname.endsWith('/')
	let page

	urlObj.path = urlObj.path || '/'

	const data = {
		page: void 0,
		query: query || urlObj.query || {},
		asPath: urlObj.path.startsWith('/')? urlObj.path: '/' + urlObj.path,
		pathname: '/' + pathname,
		mountPath: '/' + mountPath,
		fromQuery: false
	}

	if (pathname.startsWith(mountPath + '/'))
		page =  '/' + x_parseSub(mountPath, pathname)
	else if (pathname === mountPath) {
		if (!hasOwn.call(data.query, 'id')) page = endsWithSlash ? '/' : ''
		else {
			data.fromQuery = true
			page = pageFromQuery(data.query, 'id')
		}
	}

	data.page = page

	return data
}

export async function handleSubroute (Components, routerMount, routePath, ctx) {
	let pageProps
	let meta

	const parsed = parse(ctx.asPath)
	const pathname = parsed.pathname

	if (routerMount === routePath) // FIXME Strip redundant slashes
		meta = parseSubpath(routerMount, ctx.asPath)
	else meta = parseSubpath(
		pathname === routerMount ? pathname: routePath,
		parsed,
		ctx.query
	)

	const Component = Components[meta.page]

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

export async function getInitialProps (Component, ctx) {
	if (!Component) return

	let initialProps

	if (Component.preload && Component.contextTypes.loadable) {
		const _module = await Component.preload()

		Component = (_module && _module.default)
	}

	if (Component && Component.getInitialProps)
		initialProps = await Component.getInitialProps(ctx)

	return initialProps
}
