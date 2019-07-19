'use strict'

const h = require('pithy')

const footer = h.footer({id: 'footer'}, [
	h.p(null, [
		h.a({
			href: 'https://github.com/derhuerst/vbb-web'
		}, [
			h.abbr({title: 'Free Open Source Software'}, 'FOSS')
		]),
		' made with ',
		h.span({class: 'love'}, '❤'),
		' by ',
		h.a({href: 'https://juliustens.eu'}, '@juliustens'),
		' and ',
		h.a({href: 'https://jannisr.de'}, '@derhuerst'),
		'.'
	])
])

module.exports = footer
