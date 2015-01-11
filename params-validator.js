var validator = require('validator');

/**
 * Validator configuration format

 {
   name: 'k',//origin name of the post request
   alias: 'k1', //converted name for model to save
   required: true/false,
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
    'float',
    'uuid',
    'date',
    'json'
    ],
   maxLength: 10,
   minLength: 10,
   locale: 'zh-CN',
   matches: 'paramName'
 }
 */



var typePair = {
  'email': 'isMail',
  'url': 'isURL',
  'fqdn': 'isFQDN',
  'ip': 'isIP',
  'alpha': 'isAlpha',
  'numeric': 'isNumeric',
  'alphanumeric': 'isAlphaNumeric',
  'base64': 'isBase64',
  'hexadecimal': 'isHexadecimal',
  'hexcolor': 'HexColor',
  'int': 'isInt',
  'float': 'isFloat',
  'uuid': 'isUUID',
  'date': 'isDate',
  'json': 'isJSON',
  'creditcard': 'isCreditCard',
  'isbn': 'isISBN',
  'phone': 'isMobilePhone',
  'ascii': 'isAscii',
  'multibyte': 'isMultibyte'

};

module.exports = {

  validateOne: function (data, conf, error) {
    if (conf.type in typePair) {
      var func = validator[typePair[conf.type]];
      switch (conf.type) {
        case 'phone':
          return func(data, conf.locale || 'zh-CN');
        default:
          return func(data);
      }
    } else {
      switch (conf.type) {
        case 'string':
          return validator.isLength(data, conf.minLength || 0, conf.maxLength || 255);
      }
      return true;
    }

  },
  validate: function (params, confs, error) {
    for(var k in params) {
      var param = params[k];
      var conf = confs[k];
      error.key = k;
      if (!conf) {
        continue;
      }
      if (conf.required) {
        if (validator.isNull(param) || !validator.isLength(param, 1)) {
          error.reason = 'key ' + k + " is NULL";
          return false;
        }
      }

      if (conf.matches) {
        var match = params[conf.matches];
        if (param != match) {
          error.reason = 'Not match key ' + conf.matches;
          return false;
        }
      } else {
        if (!param) {
          continue;
        }
        if (!this.validateOne(param, conf, error)) {
          error.reason = 'Not validate key ' + k;
          return false;
        }
      }
    }
    error.key = null;
    return true;
  }

};