module.exports = {

  /**
   * Http request data extraction & validation
   *
   * @param req                 - HTTP request handler
   * @param data                - Data to be updated by HTTP request
   * @param {Array} params      - Params needs to be extracted from request
   *                              1. params can be a string array
   *                              2. or an object array.
   *                              3. objects can be in format
   *                                {
   *                                  name:       //origin name of the post request,
   *                                  alias:      //converted name for server side

   *                                }
   * @returns {boolean}
   */

  extract: function (req, data, params) {
    if (!params || !params.length || !data || !req || !req.param) {
      return false;
    }

    for (var i = 0; i < params.length; i++) {
      var k = params[i];
      var type = typeof k;
      switch (type) {
        case 'string':
          var v = req.param(k);
          if (v) {
            data[k] = v;
          }
          break;
        case 'object':
          var v = req.param(k.name);
          if (v) {
            data[k.alias] = v;
          }
      }
    }
    return true;
  },

  /**
   * Validating data
   *
   * @param data                  - Data to be validated
   * @param validators            - Validator objects
   *                              //validator format
   *                              {
   *                                 type: 'string', 'email', 'phone', 'ip', 'url',
   *                                 maxLength: 10,
   *                                 minLength: 10,
   *                                 locale: 'zh-CN',
   *                                 options:
   *                              }
   */
  validate: function (data, validators, reason) {

    var paramValidator = require('./params-validator');

    for (var k in validators) {
      var v = validators[k];
      if (!paramValidator.validate(data[k], v)) {
        reason = {
          k: k,
          v: v,
          data: data[k]
        }
        return false;
      }
    }
    return true;
  }
  ,

  /**
   *    Object parameters counting
   *
   * @param {Object} - Object whose attributes will be counted
   * @returns {number}
   */
  count: function (o) {
    var i = 0;
    for (var k in o) {
      i++;
    }
    return i;
  }
};
