

/**
 * Determine if the named field is a file
 *
 * @param req
 * @param name
 * @param error
 * @param cb
 * @returns {*|boolean}
 */

var isFile = function(req, name, error, cb) {
  if (req.files) {
    return cb(req.files[name] && req.files[name].size > 0);
  }
  
  if (req.file instanceof Function) {
    req.file(name).upload(function () {
      
    });
  }



};

module.exports = {

  /**
   * Verify the request input and validate the input type
   *
   * @param req                - HTTP request handler
   * @param confs              - Configuration for parameter validation
   * @param data               - Request data and data to be validated.
   * @param error              - Detailed error info
   * @returns {boolean}
   */
  v: function (req, confs, data, error) {
    var params = [];
    var ignores = [];
    for (var key in confs) {
      if (confs[key].ignore) {
        ignores.push(key);
      }
      if (confs[key].alias) {
        ignores.push(key);
        params.push({name: key, alias: confs[key].alias});
      }
      params.push(key);
    }
    if (!this.extract(req, data, params)) {
      return false;
    }
    if (!this.validate(data, confs, error)) {
      return false;
    }

    for (var i = 0; i < ignores.length; i++) {
      delete data[ignores[i]];
    }
    return true;
  },

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
   * @param params                - Data to be validated
   * @param confs                 - Validator confs
   *                              //validator configuration
   *                              {
   *                                 type: ['string', 'email', 'phone', 'ip', 'url'],
   *                                 maxLength: 10,
   *                                 minLength: 10,
   *                                 locale: 'zh-CN',
   *                                 matches: 'paramName'
   *                                 required: true/false,
   *                                 options:
   *                              }
   * @param error                 - Error info
   *
   * @returns {boolean}
   */
  validate: function (params, confs, error) {

    error = error || {};

    var validator = require('./validator');

    return validator.validate(params, confs, error)
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
