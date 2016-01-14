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
  'email': 'isEmail',
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
  'multibyte': 'isMultibyte',
  'time': 'isTime'
};

module.exports = {
  validateOne: function (data, conf, error) {
    if (conf.type in type2Func) {
      var func = validator[type2Func[conf.type]];
      switch (conf.type) {
        case 'phone':
          return func(data, conf.locale || 'zh-CN');
        case 'time':
          return /^(([0-9]||[0-1][0-9]||2[0-3]):([0-5][0-9])(:[0-5][0-9]){0,1}||24:00(:00){0,1})$/.test(data);
        default:

          if (func instanceof Function) {
            return func(data);
          }
      }
    } else {
      switch (conf.type) {
        case 'object':
          return this.validate(data, conf.validate, error);
        case 'text':
          return (typeof data === 'string') && (validator.isLength(data, conf.minLength || 0, conf.maxLength || 65536));
        case 'string':
          return (typeof data === 'string') && (validator.isLength(data, conf.minLength || 0, conf.maxLength || 255));
      }
      return true;
    }

  },
  validate: function (params, confs, error) {
    var count = 0;
    error = error || {};

    if (params instanceof Array) {
      error.reason = 'Params must not be an Array!';
      return false;
    }

    if (confs instanceof Array) {
      error.reason = 'Confs must not be an Array!';
      return false;
    }

      if (!(params instanceof Object)) {
      error.reason = 'Params must be an object!';
      return false;
    }

    if (!(confs instanceof Object)) {
      error.reason = 'Confs must be an object!';
      return false;
    }

    for(var k in confs) {
      count ++;
      var param = params[k];
      var conf = confs[k];
      error.key = k;
      if (!conf) {
        continue;
      }

      //`required` attribute passing
      if (conf.required) {
        if (validator.isNull(param) || !validator.isLength(param, 1)) {
          error.reason = 'Key ' + k + " is NULL";
          return false;
        }
      }

      //`matches` attribute passing
      if (conf.matches) {
        var match = params[conf.matches];
        if (param !== match) {
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
    delete error.key;
    if (!count) {
      return false;
    }
    return true;
  }

};
