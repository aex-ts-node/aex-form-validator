'use strict';
var assert = require('assert');
var validator = require('../../lib/validator');
describe('#alphanumeric', function () {
  it('should pass', function () {
    var params1 = {
      k4: 'all1',
      k5: '1bb'
    };
    var conf = {
      k4: {
        type: 'alphanumeric',
        required: true
      },
      k5: {
        type: 'alphanumeric',
        required: true
      }
    };
    var data = validator.validate(params1, conf);
    assert.deepEqual({
      code: 0,
      message: 'Success'
    }, data);
  });

  it('should fail', function () {
    var params1 = {
      k4: 'all1',
      k5: '#bb'
    };
    var conf = {
      k4: {
        type: 'alphanumeric',
        required: true
      },
      k5: {
        type: 'alphanumeric',
        required: true
      }
    };
    var data = validator.validate(params1, conf);
    assert.deepEqual({
      code: -1,
      key: 'k5',
      message: 'Not validate key k5'
    }, data);
  });
});
