'use strict'

module.exports = class Utilities {
    static extractValidationErrors(error){
        var err = {}
        error.data.details.forEach (function(detail) {
            var key = detail.path
            err[key] = {
                type : error.data.details[0].type,
                message : error.data.details[0].message
            }
        })
        return err
    }
    static getFormInputValues(error) {
        var values = {}
        var keys = Object.keys(error.data._object)
        keys.forEach(function(k){
            values[k] = error.data._object[k]
        });
        return values
    }
}