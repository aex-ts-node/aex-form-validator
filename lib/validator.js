'use strict';
/* eslint space-before-function-paren: 0 */

var validator = require('validator');

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

var type2Func = {
  email: 'isEmail',
  url: 'isURL',
  fqdn: 'isFQDN',
  ip: 'isIP',
  alpha: 'isAlpha',
  numeric: 'isNumeric',
  alphanumeric: 'isAlphaNumeric',
  base64: 'isBase64',
  hexadecimal: 'isHexadecimal',
  hexcolor: 'HexColor',
  int: 'isInt',
  float: 'isFloat',
  uuid: 'isUUID',
  date: 'isDate',
  json: 'isJSON',
  creditcard: 'isCreditCard',
  isbn: 'isISBN',
  phone: 'isMobilePhone',
  ascii: 'isAscii',
  multibyte: 'isMultibyte',
  time: 'isTime'
};

var typeExt = ['enum', 'object', 'text', 'string', 'bool', 'boolean', 'regex'];

var isBoolean = function (data) {
  var type = typeof data;
  if (type === 'string') {
    return ['true', 'false'].indexOf(data.toLowerCase()) !== -1;
  }
  if (type === 'boolean') {
    return true;
  }
  return false;
};

var validate = {
  validateOne: function (data, conf) {
    if (conf.type in type2Func) {
      data = String(data);
      var func = validator[type2Func[conf.type]];
      switch (conf.type) {
        case 'phone':
          return func(data, conf.locale || 'zh-CN');
        case 'time':
          return /^(([0-9]||[0-1][0-9]||2[0-3]):([0-5][0-9])(:[0-5][0-9]){0,1}||24:00(:00){0,1})$/.test(data);
        default:
          return func(data);
      }
    } else {
      switch (conf.type) {
        case 'regex':
          return conf.regex && conf.regex.test && conf.regex.test(String(data));
        case 'bool':
        case 'boolean':
          return isBoolean(data);
        case 'enum':
          return conf.enums && conf.enums instanceof Array ? conf.enums.indexOf(data) !== -1 : false;
        case 'object':
          return validate.validate(data, conf.validate);
        case 'text':
          return typeof data === 'string' && validator.isLength(data, conf.minLength || 0, conf.maxLength || 65536);
        case 'string':
        default:
          return typeof data === 'string' && validator.isLength(data, conf.minLength || 0, conf.maxLength || 255);
      }
    }
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
        error.key = k;
        if (!conf) {
          continue;
        }

        // `required` attribute passing
        if (conf.required) {
          if (param === undefined) {
            error.message = 'Key ' + k + ' is undefined';
            return error;
          }
          if (param === null) {
            error.message = 'Key ' + k + ' is NULL';
            return error;
          }
          if (typeof param === 'string' && (validator.isEmpty(param) || !validator.isLength(param, 1))) {
            error.message = 'Key ' + k + ' is NULL';
            return error;
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
          if (!(conf.type in type2Func) && (typeExt.indexOf(conf.type) === -1)) {
            error.message = 'Type for key \'' + k + '\' is not valid!';
            return error;
          }
          var result = validate.validateOne(param, conf);
          if (result === true || result.code === 0) {
            continue;
          }
          error.message = 'Not validate key ' + k;
          return error;
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
