'use strict'

const h = require('pithy')

const completion = require('./lib/completion')
const enableJS = require('./lib/enable-js')
const head = require('./lib/head')
const footer = require('./lib/footer')

const form = (station) => {
	return h.form({
		action: 'journeys',
		method: 'GET'
	}, [
		completion({
			id: 'origin',
			name: 'origin',
			placeholder: 'origin',
			text: '',
			value: ''
		}),
		completion({
			id: 'destination',
			name: 'destination',
			placeholder: 'destination',
			text: '',
			value: ''
		}),
		h.input({
			type: 'text',
			name: 'when',
			value: '+10 minutes',
			placeholder: 'specify a time'
		}),
		h.input({
			type: 'submit',
			value: 'show journeys'
		})
	])
}

const page = () => [
	`<!DOCTYPE html>`,
	h.html({lang: 'en'}, [
		head(['main.css']),
		h.body(null, [
			h.h1(null, 'Journeys'),
			enableJS,
			form(),
			footer,
			h.script({type: 'application/javascript', src: './bundle.js'})
		])
	])
].join('\n')

module.exports = page
