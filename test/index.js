'use strict';
/* eslint space-before-function-paren: 0 */

var assert = require('assert');
var filter = require('../lib/index');
describe('node-form-validator', function () {
  describe('#validate()', function () {
    it('should enabled validate string with length limite', function () {
      var params1 = {
        k1: 'hell'
      };
      var confs = {
        k1: {
          type: 'string',
          minLength: 5
        }
      };
      var params2 = {
        k2: 'hell'
      };
      var confs2 = {
        k2: {
          type: 'string',
          maxLength: 3
        }
      };
      var params3 = {
        k3: 'hell'
      };
      var confs3 = {
        k3: {
          type: 'string',
          maxLength: 4,
          minLength: 1
        }
      };
      assert.deepEqual({
        code: -1,
        key: 'k1',
        message: 'Not validate key k1 is too short!'
      }, filter._validate(params1, confs));

      assert.deepEqual({
        code: -1,
        key: 'k2',
        message: 'Not validate key k2 is too long!'
      }, filter._validate(params2, confs2));

      assert.deepEqual({
        code: 0,
        message: 'Success'
      }, filter._validate(params3, confs3));
    });

    it('should validate mobile phone numbers', function () {
      var params1 = {
        k1: '13581723443'
      };
      var confs = {
        k1: {
          type: 'phone',
          locale: 'zh-CN'
        }
      };
      assert.deepEqual({
        code: 0,
        message: 'Success'
      }, filter._validate(params1, confs));
      var params2 = {
        k2: 'aaaa'
      };
      var confs2 = {
        k2: {
          type: 'phone',
          locale: 'zh-CN'
        }
      };
      assert.deepEqual({
        code: -1,
        key: 'k2',
        message: 'Not validate key k2'
      }, filter._validate(params2, confs2));
    });

    it('should validate matches', function () {
      var params1 = {
        k1: '13581723443',
        k2: '13581723443'
      };
      var confs = {
        k2: {
          matches: 'k1'
        }

      };
      assert.deepEqual({
        code: 0,
        message: 'Success'
      }, filter._validate(params1, confs));

      var params2 = {
        k1: '13581723443',
        k2: 'aaaa'
      };
      var confs2 = {
        k2: {
          matches: 'k1'
        }
      };
      assert.deepEqual({
        code: -1,
        key: 'k2',
        message: 'Not match key k1'
      }, filter._validate(params2, confs2));
    });

    it('should validate required', function () {
      var params1 = {
        k1: 'sdfsdf'
      };
      var confs = {
        k1: {
          type: 'string',
          required: true
        }
      };

      assert.deepEqual({
        code: 0,
        message: 'Success'
      }, filter._validate(params1, confs));

      params1.k1 = undefined;
      assert.deepEqual({
        code: -1,
        key: 'k1',
        message: 'Key k1 is undefined'
      }, filter._validate(params1, confs));

      params1.k1 = null;
      assert.deepEqual({
        code: -1,
        key: 'k1',
        message: 'Key k1 is NULL'
      }, filter._validate(params1, confs));
    });

    it('should validate many params together', function () {
      var params1 = {
        k1: '13581723443',
        k2: 'hello',
        k3: 'http://www.foobar.com/'
      };
      var confs = {
        k1: {

          type: 'phone',
          locale: 'zh-CN'

        },
        k2: {
          type: 'string',
          minLength: 3,
          maxLength: 5
        },
        k3: {
          type: 'url'
        }
      };
      var error = {};

      assert.deepEqual({
        code: 0,
        message: 'Success'
      }, filter._validate(params1, confs, error));
    });

    it('should validate matches', function () {
      var params1 = {
        k1: '13581723443',
        k2: 'hello',
        k3: 'http://www.foobar.com/'
      };
      var confs = {
        k1: {

          type: 'phone',
          locale: 'zh-CN'

        },
        k2: {
          matches: 'k1'
        },
        k3: {
          type: 'url'
        }
      };

      assert.deepEqual({
        code: -1,
        key: 'k2',
        message: 'Not match key k1'
      }, filter._validate(params1, confs));
    });

    it('should not validate arrays', function () {
      var params1 = ['aa', 'ddd', 'ddd'];
      var confs = {
        k1: {

          type: 'phone',
          locale: 'zh-CN'

        },
        k2: {
          matches: 'k1'
        },
        k3: {
          type: 'url'
        }
      };

      assert.deepEqual({
        code: -1,
        message: 'Params must not be an Array!'
      }, filter._validate(params1, confs));
    });
  });

  it('should not validate integer as string', function () {
    var params1 = {
      k1: 1
    };
    var confs = {
      k1: {
        type: 'string',
        required: true
      }
    };
    var error = filter._validate(params1, confs);
    assert.deepEqual({
      code: -1,
      key: 'k1',
      message: 'Not validate key k1 is not a string type!'
    }, error);
  });

  it('should validate string', function () {
    var params1 = {
      k1: '1'
    };
    var confs = {
      k1: {
        type: 'string',
        required: true
      }
    };
    var error = filter._validate(params1, confs);

    assert.deepEqual({
      code: 0,
      message: 'Success'
    }, error);
  });

  it('should validate zero number', function () {
    var params1 = {
      state: 'STATE',
      scope: 0
    };
    var confs = {
      state: {
        type: 'string',
        maxLength: 32,
        required: true
      },
      scope: {
        type: 'int',
        required: true
      }
    };
    var error = filter.validate(params1, confs);
    assert.deepEqual({
      code: 0,
      message: 'Success',
      data: {
        state: 'STATE',
        scope: 0
      }
    }, error);
  });
});
