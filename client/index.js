'use strict'

const completion = require('./lib/completion')
const stations = require('./lib/stations')

const suggest = (query, cb) => stations(query, cb)

const origin = document.getElementById('origin')
if (origin) {
	completion(origin, {
		  suggest: suggest
		, render:  (l) => l.name
		, value:   (l) => l.id
	})
}

const destination = document.getElementById('destination')
if (destination) {
	completion(destination, {
		suggest: suggest
		, render: (l) => l.name
		, value: (l) => l.id
	})
}

const checkinButtons = Array.from(document.querySelectorAll('.db-journey-ui-checkin-button'))
checkinButtons.forEach(checkinButton => {
	checkinButton.addEventListener('click', () => {
		if (!Array.from(checkinButton.classList).includes('start')) return
		checkinButton.classList.remove('start')
		checkinButton.classList.add('loading')
		setTimeout(() => {
			checkinButton.classList.remove('loading')
			checkinButton.classList.add('fail')
		}, 3000)
	})
})
