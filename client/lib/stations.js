'use strict'

const stations = async (query, cb) => {
	if (query.length === 0) return Promise.resolve([])
	try {
		const response = await fetch(`https://2.db.transport.rest/locations?query=${query}&stations=true&poi=false&addresses=false&stationLines=false&results=5`)
		const results = await response.json()
		return cb(results)
	} catch (error) {
		console.error(err)
		return cb([])
	}
}

module.exports = stations
