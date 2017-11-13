const modelData = require('../models/planning')
var Joi = require('joi');

module.exports = [
	{
		method: 'GET',
		path: '/flood-risk-assessment/find-location',
		config: {
			handler: function (request, reply) {
				return reply.view('planning/location', {
					'serviceName' : 'Check flood zone',
					'pageTitle' : 'Find location - Check flood zone - GOV.UK',
					'values' : { 'type' : 'postcodeTown' }
				})
			}
		}
	},
	{
		method: 'POST',
		path: '/flood-risk-assessment/find-location',
		config: {
			handler: function (request, reply) {
				return reply.view('planning/site', {
					'serviceName' : 'Check flood zone',
					'pageTitle' : 'Identify boundary - Check flood zone - GOV.UK'
				})
			},
			validate: {
				options: {
					allowUnknown: true
				},
				payload: {
					postcodeTown: Joi.any().when('type', {
						is: 'postcodeTown',
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
						errors = ExtractValidationErrors(error) // the error field + message
						values = ReturnFormInputValues(error) // avoid wiping form data
					}
					return reply.view('planning/location', {
						'serviceName' : 'Check flood zone',
						'pageTitle' : 'Error: Find location - Check flood zone - GOV.UK',
						'errors'  : errors, // error object used in html template
						'values' : values  // (escaped) values displayed in form inputs
					})//.code(error ? 400 : 200) HTTP status code depending on error
				}
			}
		}
	},
	{
		method: 'GET',
		path: '/flood-risk-assessment/identify-boundary',
		config: {
			handler: function (request, reply) {
				return reply.view('planning/site', {
					'serviceName' : 'Check flood zone',
					'pageTitle' : 'Identify boundary - Check flood zone - GOV.UK'
				})
			}
		}
	}
]

function ExtractValidationErrors(error){

	err = {}
	error.data.details.forEach (function(detail) {
		var key = detail.path
		err[key] = {
			type : error.data.details[0].type,
			message : error.data.details[0].message
		}
	})
	return err
	
}

function ReturnFormInputValues(error) {
	var values = {}
	var keys = Object.keys(error.data._object)
	keys.forEach(function(k){
		values[k] = error.data._object[k]
	});
	return values
}