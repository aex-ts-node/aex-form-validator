'use strict';
/* eslint space-before-function-paren: 0 */

var assert = require('assert');
var validator = require('../lib/validator');

describe('#validate()', function () {
  it('should validate count zero', function () {
    var params1 = {
      k4: '13581723443',
      k5: 'hello',
      k6: 'http://www.foobar.com/'
    };
    var data = validator.validate(params1, {});
    assert.deepEqual({
      code: -1,
      message: 'No attribute validated!'
    }, data);
  });

  it('should validate string length 0', function () {
    var params1 = {
      k: ''
    };
    var data = validator.validate(params1, {
      k: {
        type: 'string',
        required: true
      }
    });
    assert.deepEqual({
      code: -1,
      key: 'k',
      message: 'Key k is NULL'
    }, data);
  });

  it('should continue no conf', function () {
    var params1 = {
      k: '',
      p: 'sdf'
    };
    var data = validator.validate(params1, {
      k: '',
      p: {
        type: 'string'
      }
    });
    assert.deepEqual({
      code: 0,
      message: 'Success'
    }, data);
  });

  it('should not pass without confs', function () {
    var params1 = {
      k: '',
      p: 'sdf'
    };
    var data = validator.validate(params1, null);
    assert.deepEqual({
      code: -1,
      message: 'Confs must be an object!'
    }, data);
  });

  it('should not pass without params', function () {
    var data = validator.validate(null, {});
    assert.deepEqual({
      code: -1,
      message: 'Params must be an object!'
    }, data);
  });

  it('should not pass without params', function () {
    var data = validator.validate([], {});
    assert.deepEqual({
      code: -1,
      message: 'Params must not be an Array!'
    }, data);
  });

  it('should not pass without params', function () {
    var data = validator.validate({}, []);
    assert.deepEqual({
      code: -1,
      message: 'Confs must not be an Array!'
    }, data);
  });

  it('should validate object', function () {
    var data = validator.validate({
      k: {
        k1: 1
      }
    }, {
      k: {
        type: 'object',
        validate: {
          k1: {
            type: 'int',
            required: true
          }
        }
      }
    });
    assert.deepEqual({
      code: 0,
      message: 'Success'
    }, data);
  });

  it('should fail to validate object', function () {
    var data = validator.validate({
      k: {}
    }, {
      k: {
        type: 'object',
        validate: {
          k1: {
            type: 'int',
            required: true
          }
        }
      }
    });
    assert.deepEqual({
      code: -1,
      key: 'k',
      message: 'Not validate key k'
    }, data);
  });

  it('should fail to validate object', function () {
    var data = validator.validate({
      k: {}
    }, {
      k: {
        type: 'gooo'
      }
    });
    assert.deepEqual({
      code: -1,
      key: 'k',
      message: 'Type for key "k" is not valid!'
    }, data);
  });

  it('should validate text', function () {
    var data = validator.validate({
      k: 'sdfsf'
    }, {
      k: {
        type: 'text',
        required: true
      }
    });
    assert.deepEqual({
      code: 0,
      message: 'Success'
    }, data);
  });
});
