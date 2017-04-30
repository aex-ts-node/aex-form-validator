'use strict';
var assert = require('assert');
var validator = require('../../lib/validator');
describe('#data', function () {
  it('date', function () {
    var params1 = {
      k4: '1990-10-10',
      k5: '1990-10-10 12:10:10',
      k6: '2017-04-30T12:02:19.650Z',
      k7: 'Sun Apr 30 2017 20:01:42 GMT+0800 (CST)',
      k8: '1111',
      k9: 'sdf9s9f9sfdf'
    };
    var conf = {
      k4: {
        type: 'date',
        required: true
      },
      k5: {
        type: 'date',
        required: true
      },
      k6: {
        type: 'date',
        required: true
      },
      k7: {
        type: 'date',
        required: true
      },
      k8: {
        type: 'date',
        required: true
      },
      k9: {
        type: 'date',
        required: true
      }
    };
    var data = validator.validate(params1, conf);
    console.log(data);
    assert.deepEqual({
      code: -1,
      key: 'k9',
      message: 'Not validate key k9'
    }, data);
  });

  it('date', function () {
    var params1 = {
      k4: 111
    };
    var conf = {
      k4: {
        type: 'date',
        required: true
      }
    };
    var data = validator.validate(params1, conf);
    console.log(data);
    assert.deepEqual({
      code: -1,
      key: 'k4',
      message: 'Not validate key k4'
    }, data);
  });
});
