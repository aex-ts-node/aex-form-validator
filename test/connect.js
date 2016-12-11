'use strict';
/* eslint space-before-function-paren: 0 */

var assert = require('assert');
var filter = require('../lib/index');

describe('#asConnect()', function () {
  it('should extract nothing', function (done) {
    var req = {};
    var res = {};
    filter.asConnect(req, res, function () {
      assert(req.validate === filter.validate);
      assert(req.extract === filter.extract);
      done();
    });
  });
});
