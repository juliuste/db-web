'use strict'

const createHafas = require('db-hafas')
const parseRelativeTimeExpression = require('parse-relative-time').default
const template = require('./tpl/journeys')

const hafas = createHafas('db-web')

const parseRelativeTime = (when) => {
	if (when === 'now') return Date.now()
	const ms = parseRelativeTimeExpression(when)
	if (ms !== null) return Date.now() + ms
	const t = +new Date(when)
	if (!Number.isNaN(t)) return t
	throw new Error('unparsable input')
}

const journeys = async (req, res) => {
	if (!req.query.origin) return res.status(400).end('missing origin')
	if (!req.query.destination) return res.status(400).end('missing destination')
	const [origin, destination] = await Promise.all([
		hafas.stop(req.query.origin),
		hafas.stop(req.query.destination)
	])
	if (!origin) return res.status(400).end('invalid origin')
	if (!destination) return res.status(400).end('invalid destination')

	let options = {
		departure: req.query.when ? parseRelativeTime(req.query.when) : Date.now(),
		stopovers: true,
		// duration: 60
		results: 1
	}
	if (req.query.laterRef) {
		options.laterThan = req.query.laterRef
		delete options.departure // @todo
	}

	hafas.journeys(origin.id, destination.id, options)
	.then(({journeys, laterRef}) => {
		res.status(200).end(template(origin, destination, journeys, laterRef))
	})
	.catch((err) => {
		if (process.env.NODE_ENV === 'dev') console.error(err.stack)
		const body = process.env.NODE_ENV === 'dev' ? err.stack : err.message
		res.status(err.statusCode || 500).end(body)
	})
}

module.exports = journeys
