const utilities = require('../utilities/utilities.js')
const modelData = require('../models/planning')
var Joi = require('joi')

module.exports = [
	{
		method: 'GET',
		path: '/flood-risk-assessment/find-location',
		config: {
			handler: function (request, reply) {
				return reply.view('planning/find-location', {
					'serviceName' : 'Check flood zone',
					'pageTitle' : 'Find location - Check flood zone - GOV.UK',
					'model' : { 'values' : { 'type' : 'place' }}
				})
			}
		}
	},
	{
		method: 'POST',
		path: '/flood-risk-assessment/find-location',
		config: {
			handler: function (request, reply) {

				// We have a place search
				if (request.payload.type == 'place') {

					// Prototype only uses place to check if in England
					var country = modelData.getCountry(request.payload.place)

					// We have an existing place that is in Scotalnd, Wales or Northern Ireland
					if (country != null && country.code != 'e') {
						return reply.view('planning/alternate-service', {
							'serviceName' : 'Check flood zone',
							'pageTitle' : 'Error: Find location - Check flood zone - GOV.UK',
							'model' : { 'errors' : { 'country' : country } }
						}) // .code(error ? 400 : 200) // HTTP status code depending on error
					}

					// Can't find the place
					if (country == null) {
						return reply.view('planning/find-location', {
							'serviceName' : 'Check flood zone',
							'pageTitle' : 'Error: Find location - Check flood zone - GOV.UK',
							'model' : { 'errors'  : { 'place' : { 'type' : 'any.notFound', 'message' : '' } }, 'values' : { 'type' : 'place', 'place' : request.payload.place } }
						}) // .code(error ? 400 : 200) // HTTP status code depending on error
					}

				}

				// Valid place and other search types
				return reply.redirect('/flood-risk-assessment/identify-site')

			},
			validate: {
				options: {
					allowUnknown: true
				},
				payload: {
					place: Joi.any().when('type', {
						is: 'place',
						then: Joi.string().required(),
						otherwise: Joi.optional()
					}),
					ngr: Joi.any().when('type', {
						is: 'ngr',
						then: Joi.string().required(),
						otherwise: Joi.optional()
					}),
					easting: Joi.any().when('type', {
						is: 'en',
						then: Joi.string().required(),
						otherwise: Joi.optional()
					}),
					northing: Joi.any().when('type', {
						is: 'en',
						then: Joi.string().required(),
						otherwise: Joi.optional()
					}),
					type: Joi.string()
				},
				failAction: function (request, reply, source, error) {
					var errors, values
					if(error && error.data) {
						errors = utilities.extractValidationErrors(error) // the error field + message
						values = utilities.getFormInputValues(error) // avoid wiping form data
					}
					return reply.view('planning/find-location', {
						'serviceName' : 'Check flood zone',
						'pageTitle' : 'Error: Find location - Check flood zone - GOV.UK',
						'model' : { 'errors'  : errors, 'values' : values}
					}) // .code(error ? 400 : 200) // HTTP status code depending on error
				}
			}
		}
	},
	{
		method: 'GET',
		path: '/flood-risk-assessment/identify-site',
		config: {
			handler: function (request, reply) {
				return reply.view('planning/identify-site', {
					'serviceName' : 'Check flood zone',
					'pageTitle' : 'Identify boundary - Check flood zone - GOV.UK'
				})
			}
		}
	}
]