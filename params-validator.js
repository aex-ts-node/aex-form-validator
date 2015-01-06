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
    'phone',
    'ip',
    'url',
    'alpha',
    'number',
    'alphanumeric',
    'int',
    'float',
    'date',
    'json'
    ],
   maxLength: 10,
   minLength: 10,
   locale: 'zh-CN',
 }
 */

var type2func = {
  'string': function (data, conf) {
    return validator.isLength(data, conf.minLength || 0, conf.maxLength || 255);
  },
  'email': function(data) {
    return validator.isEmail(data);
  },
  'ip': function(data) {
    return validator.isIP(data);
  },
  'url': function(data) {
    return validator.isIP(data);
  },
  'phone': function(data, conf) {
    return validator.isMobilePhone(data, conf.locale);
  },
  'alpha': function(data) {
    return validator.isAlpha(data);
  }
};

module.exports = {

  validate: function(data, conf) {

  }

};