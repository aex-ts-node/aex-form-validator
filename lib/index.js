'use strict';

var validator = {

  /**
   * Verify the request input and validate the input type
   *
   * @param req                - HTTP request handler
   * @param confs              - Configuration for parameter validation
   * @param data               - Request data and data to be validated.
   * @param error              - Detailed error info
   * @returns {boolean}
   */
  validate: function (data, confs) {
    var params = validator._getParams(confs);
    var ignores = validator._getIgnores(confs);
    var extracted = validator._extract(data, params);
    if (Object.keys(extracted).length <= 0) {
      return false;
    }
    var error = validator._validate(extracted, confs);
    for (var i = 0; i < ignores.length; i++) {
      delete extracted[ignores[i]];
    }
    error.data = extracted;
    return error;
  },
  _validate: require('./validator').validate,
  _getIgnores: function (confs) {
    var ignores = [];
    for (var key in confs) {
      if (confs[key].ignore) {
        ignores.push(key);
      }
      if (confs[key].alias) {
        ignores.push(key);
      }
    }
    return ignores;
  },
  _getParams: function (confs) {
    var params = [];
    for (var key in confs) {
      if (confs[key].alias) {
        params.push({
          name: key,
          alias: confs[key].alias
        });
      }
      params.push(key);
    }
    return params;
  },
  extract: function (json, confs) {
    var params = validator._getParams(confs);
    return this._extract(json, params);
  },
  _extract: function (json, params) {
    if (!json || !params) {
      return false;
    }
    var data = {};
    for (var i = 0; i < params.length; i++) {
      var k = params[i];
      var v = null;
      var type = typeof k;
      switch (type) {
        case 'object':
          v = json[k.name];
          if (v) {
            data[k.alias] = v;
          }
          break;
        case 'string':
        default:
          v = json[k];
          if (typeof v !== 'undefined') {
            data[k] = v;
          }
          break;
      }
    }
    if (!Object.keys(data).length) {
      return false;
    }
    return data;
  },
  asConnect: function (req, res, next) {
    req.validate = validator.validate;
    req.extract = validator.extract;
    next();
  }
};

module.exports = validator;
