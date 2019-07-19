'use strict'

const h = require('pithy')
const { DateTime } = require('luxon')
const ms = require('ms')
const createRenderJourney = require('db-journey-ui')
const toString = require('virtual-dom-stringify')
const { range } = require('lodash')

const line = require('./lib/line')
const head = require('./lib/head')

const timezone = process.env.TIMEZONE
if (!timezone) {
	console.error('Missing TIMEZONE env var.')
	process.exit(1)
}
const locale = process.env.LOCALE
if (!locale) {
	console.error('Missing LOCALE env var.')
	process.exit(1)
}

const formatTime = (when) => {
	return DateTime.fromJSDate(when, {
		zone: timezone,
		locale
	}).toLocaleString(DateTime.TIME_SIMPLE)
}

const formatDelay = (delay) => {
	if (delay === 0) return null // todo: show +0
	const color = Math.abs(delay) >= 30 ? '#c0392b' : '#27ae60'
	const text = delay < 0
		? '-' + ms(-delay * 1000)
		: '+' + ms(delay * 1000)
	return h.span({ style: { color } }, [text])
}

const renderJourney = createRenderJourney(formatTime, formatDelay, {})

// const departures = (deps) => {
// 	return h.table('#departures', deps.map((dep) => {
// 		return h.tr(null, [
// 			h.td('.departures-when', [
// 				time(dep.when),
// 				h.span('.departures-delay', [
// 					delay(dep.delay)
// 				])
// 			]),
// 			h.td('.departures-line', [
// 				line(dep.line)
// 			]),
// 			h.td('.departures-direction', [
// 				'→ ' + dep.direction
// 			])
// 		])
// 	}))
// }

const journeysList = journeys => {
	const fixedJourneys = journeys.map(journey => ({
		...journey,
		legs: journey.legs.filter(leg => !leg.walking && !leg.transfer) // @todo
	}))

	return h.table('#journeysList', fixedJourneys.map(journey => {
		const rendered = new h.SafeString(toString(renderJourney(journey, range(0))))
		return h.tr(null, [h.td(null, [rendered])])
	}))
}

const moreJourneysForm = (originId, destinationId, laterRef) => {
	return h.form({action: 'journeys', method: 'GET'}, [
		h.input({
			type: 'hidden',
			name: 'origin',
			value: originId
		}),
		h.input({
			type: 'hidden',
			name: 'destination',
			value: destinationId
		}),
		h.input({
			type: 'hidden',
			name: 'laterRef',
			value: laterRef
		}),
		h.input({
			type: 'submit',
			value: 'next journey'
		})
	])
}

const noJourneys = h.p({}, 'no journeys')

const page = (origin, destination, journeys, laterRef) => {
	const lastJourney = journeys[journeys.length - 1]
	return [
		  `<!DOCTYPE html>`
		, h.html({lang: 'en'}, [
			head(['main.css', 'journey.css']),
			h.body(null, [
				  h.h1(null, `${origin.name} → ${destination.name}`)
				, journeys.length > 0 ? journeysList(journeys) : noJourneys
				, lastJourney ? moreJourneysForm(origin.id, destination.id, laterRef) : ''
				, h.script({ type: 'application/javascript', src: './bundle.js' })
			])
		])
	].join('\n')
}

module.exports = page
