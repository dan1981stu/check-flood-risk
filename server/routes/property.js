const utilities = require('../utilities/utilities.js')
const modelData = require('../models/property')
var Joi = require('joi')

module.exports = [
	{
		method: 'GET',
		path: '/find-address',
		config: {
			handler: function (request, reply) {
				const scenario = request.query.s ? request.query.s : 'a'
				return reply.view('property/find-address', {
					'pageTitle' : 'Find address - Property flood risk - GOV.UK',
					'model' : { 'scenario' : scenario }
				})
			}
		}
	},
	{
		method: 'POST',
		path: '/find-address',
		config: {
			handler: function (request, reply) {
				const scenario = request.payload.scenario ? request.payload.scenario : 'a'
				var premises = request.payload.premises.toLowerCase()
				var postcode = request.payload.postcode.replace(/ /g,'-').toLowerCase()
				var address = modelData.getAddress(premises, postcode)
				// If we have a valid address
				if (address.length) {
					return reply.redirect('/select-address?premises=' + premises + '&postcode=' + postcode + '&s='+ scenario)
				}
			},
			validate: {
				options: {
					allowUnknown: true
				},
				payload: {
					premises: Joi.string().required(),
					postcode: Joi.string().required()
				},
				failAction: function (request, reply, source, error) {
					var errors, values
					const scenario = request.payload.scenario ? request.payload.scenario : 'a'
					if(error && error.data) {
						errors = utilities.extractValidationErrors(error) // the error field + message
						values = utilities.getFormInputValues(error) // avoid wiping form data
					}
					return reply.view('property/find-address', {
						'pageTitle' : 'Error: Find address - Property flood risk - GOV.UK',
						'model' : { 'errors'  : errors, 'values' : values, 'scenario' : scenario }
					}) // .code(error ? 400 : 200) // HTTP status code depending on error
				}
			}
		}
	},
	{
		method: 'GET',
		path: '/select-address',
		config: {
			handler: function (request, reply) {
				const scenario = request.query.s ? request.query.s : 'a'
				const premises = request.query.premises ? request.query.premises : 'error'
				const postcode = request.query.postcode ? request.query.postcode : 'error'

				if (premises === 'error' || postcode === 'error') {
					return reply.view('404').code(404)
				}
				
				var address = modelData.getAddress(premises, postcode)

				return reply.view('property/select-address', {
					'pageTitle' : 'Select address - Property flood risk - GOV.UK',
					'model' : { 'address' : address, 'scenario' : scenario }
				})
			}
		}
	},
	{
		method: 'POST',
		path: '/select-address',
		config: {
			handler: function (request, reply) {
				const scenario = request.payload.scenario ? request.payload.scenario : 'a'
				return reply.redirect('/<address>?scenario='+ scenario)
			},
			validate: {
				options: {
					allowUnknown: true
				},
				payload: {
					address: Joi.string().required()
				},
				failAction: function (request, reply, source, error) {
					var errors, values
					if(error && error.data) {
						errors = utilities.extractValidationErrors(error) // the error field + message
						values = utilities.getFormInputValues(error) // avoid wiping form data
					}
					return reply.view('property/select-address', {
						'pageTitle' : 'Error: Select address - Property flood risk - GOV.UK',
						'model' : { 'errors'  : errors, 'values' : values, 'scenario' : scenario }
					}) // .code(error ? 400 : 200) // HTTP status code depending on error
				}
			}
		}
	}
]