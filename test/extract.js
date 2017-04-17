'use strict';
/* eslint space-before-function-paren: 0 */

var assert = require('assert');
var filter = require('../lib/index');
var params = ['a', 'b', {
  name: 'c',
  alias: 'd'
}];

var data = {
  a: 100,
  b: 200,
  c: 300
};

describe('#extract()', function () {
  var result;
  it('should return false when the data is not present', function () {
    assert.equal(false, filter._extract(null, params));
  });

  it('should return false when the params is not present', function () {
    assert.equal(false, filter._extract(data));
  });

  it('should return false when the req is not present', function () {
    assert.deepEqual({
      a: 100,
      b: 200,
      d: 300
    }, filter._extract(data, params));
  });

  it('should return true when all the params are present', function () {
    result = filter._extract(data, params);
    assert.deepEqual({
      a: 100,
      b: 200,
      d: 300
    }, result);
  });
  it('should extract nothing', function () {
    result = filter.validate({}, {});
    assert.equal(false, result);
  });

  it('should extract data', function () {
    result = filter.extract(
      {
        a: '100',
        b: 100
      }, {
        a: {
          type: 'string',
          required: true
        },
        b: {
          type: 'int'
        }
      }
    );
    assert.deepEqual({
      a: '100',
      b: 100
    }, result);
  });
});
