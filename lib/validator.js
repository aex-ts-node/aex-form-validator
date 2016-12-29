'use strict';

var validator = require('validator');
var types = require('./types');
var required = require('./checkers/required');

/**
 * Validator configuration format

 {
   name: 'k',//origin name of the post request
   alias: 'k1', //converted name for model to save
   required: true/false,
   alias: 'extractedName',
   type: [
    'string',
    'email',
    'url',
    'fqdn',
    'ip',
    'alpha',
    'numeric',
    'alphanumeric',
    'base64',
    'hexadecimal',
    'hexcolor',
    'int',
    'bool',
    'float',
    'uuid',
    'date',
    'json',
    'object'
    ],
   maxLength: 10,
   minLength: 10,
   locale: 'zh-CN',
   matches: 'paramName'
 }
 */

var validate = {
  validateOne: function (data, conf) {
    if (conf.type === 'object') {
      return validate.validate(data, conf.validate);
    }
    if (conf.type in types) {
      switch (typeof types[conf.type]) {
        case 'function':
          return types[conf.type](data, conf);
        default:
          return validator[types[conf.type]](String(data));
      }
    }
  },

  updateError: function (result, error, k) {
    switch (result) {
      case -1:
        error.message = 'Not validate key ' + k + ' is not a string type!';
        break;
      case -2:
        error.message = 'Not validate key ' + k + ' is too short!';
        break;
      case -3:
        error.message = 'Not validate key ' + k + ' is too long!';
        break;
      case -4:
        error.message = 'Not validate key ' + k + ' is exceeding the allowed max length!';
        break;
      default:
        error.message = 'Not validate key ' + k;
        break;
    }
    return error;
  },

  validate: function (params, confs) {
    var count = 0;
    var error = {
      code: -1
    };

    if (params instanceof Array) {
      error.message = 'Params must not be an Array!';
      return error;
    }

    if (confs instanceof Array) {
      error.message = 'Confs must not be an Array!';
      return error;
    }

    if (!(params instanceof Object)) {
      error.message = 'Params must be an object!';
      return error;
    }

    if (!(confs instanceof Object)) {
      error.message = 'Confs must be an object!';
      return error;
    }

    for (var k in confs) {
      if (typeof k === 'string') {
        count++;
        var param = params[k];
        var conf = confs[k];
        var result;
        error.key = k;
        if (!conf) {
          continue;
        }

        // `required` attribute passing
        if (conf.required) {
          result = required(param, k, error);
          if (result) {
            return result;
          }
        }
        // `matches` attribute passing
        if (conf.matches) {
          var match = params[conf.matches];
          if (param !== match) {
            error.message = 'Not match key ' + conf.matches;
            return error;
          }
        } else {
          if (!param) {
            continue;
          }
          if (!(conf.type in types)) {
            error.message = 'Type for key \'' + k + '\' is not valid!';
            return error;
          }
          result = validate.validateOne(param, conf);
          if (result === true || result.code === 0) {
            continue;
          }
          return validate.updateError(result, error, k);
        }
      }
    }
    delete error.key;
    if (!count) {
      error.message = 'No attribute validated!';
      return error;
    }
    error.code = 0;
    error.message = 'Success';
    return error;
  }
};

module.exports = validate;
