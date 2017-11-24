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
				var premises = request.payload.premises
				var postcode = request.payload.postcode
				var model = modelData.getProperty(premises, postcode, scenario)
				
				// If we have an one or more existing addresses
				if (model.hasExistingAddress) {

					// If postcode is England
					if (model.isEngland) {
						return reply.redirect(
							'/confirm-address?premises=' + model.premises + '&postcode=' + model.postcode.replace(/ /g,'-') + '&s='+ scenario
						)
					}

					// Postcode is in Scotland, Wales or Northern Ireland
					else {
						return reply.view('property/alternate-service', {
							'pageTitle' : 'Error: Find address - Property flood risk - GOV.UK',
							'model' : model
						})
					}

				}

				// We don't have an existing address
				else {
					return reply.view('property/find-address', {
						'pageTitle' : 'Error: Find address - Property flood risk - GOV.UK',
						'model' : model
					}) // .code(error ? 400 : 200) // HTTP status code depending on error
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

					const scenario = request.payload.scenario ? request.payload.scenario : 'a'
					var premises = request.payload.premises
					var postcode = request.payload.postcode
					var model = modelData.getProperty(premises, postcode, scenario, error)
					
					return reply.view('property/find-address', {
						'pageTitle' : 'Error: Find address - Property flood risk - GOV.UK',
						'model' : model
					}) // .code(error ? 400 : 200) // HTTP status code depending on error

				}
			}
		}
	},
	{
		method: 'GET',
		path: '/confirm-address',
		config: {
			handler: function (request, reply) {

				const scenario = request.query.s ? request.query.s : 'a'
				const premises = request.query.premises ? request.query.premises : 'error'
				const postcode = request.query.postcode ? request.query.postcode : 'error'

				if (premises === 'error' || postcode === 'error') {
					return reply.view('404').code(404)
				}
				
				var model = modelData.getProperty(premises, postcode, scenario)
				
				return reply.view('property/confirm-address', {
					'pageTitle' : 'Select address - Property flood risk - GOV.UK',
					'model' : model
				})

			}
		}
	},
	{
		method: 'POST',
		path: '/confirm-address',
		config: {
			handler: function (request, reply) {

				const scenario = request.payload.scenario ? request.payload.scenario : 'a'
				const property = request.payload.property

				return reply.redirect('/property/' + property + '?s='+ scenario)

			},
			validate: {
				options: {
					allowUnknown: true
				},
				payload: {
					property: Joi.string().required()
				},
				failAction: function (request, reply, source, error) {

					const scenario = request.payload.scenario ? request.payload.scenario : 'a'
					var premises = request.payload.premises
					var postcode = request.payload.postcode
					var model = modelData.getProperty(premises, postcode, scenario, error)

					return reply.view('property/confirm-address', {
						'pageTitle' : 'Error: Select address - Property flood risk - GOV.UK',
						'model' : model
					}) // .code(error ? 400 : 200) // HTTP status code depending on error
				}
			}
		}
	}
]