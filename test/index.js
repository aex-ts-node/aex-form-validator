'use strict';
/* eslint space-before-function-paren: 0 */

var assert = require('assert');
describe('node-form-validator', function() {
  var filter = require('../lib/index');
  var req = {
    body: {
      a: 100,
      b: 200,
      c: 300
    }
  };

  var params = ['a', 'b', {
    name: 'c',
    alias: 'd'
  }];

  var data = {};

  describe('#extract()', function() {
    it('should return false when the req is not present', function() {
      assert.equal(false, filter.extract(null, data, params));
    });

    it('should return false when the data is not present', function() {
      assert.equal(false, filter.extract(req, null, params));
    });

    it('should return false when the params is not present', function() {
      assert.equal(false, filter.extract(req, data, null));
    });

    it('should return true when all the params are present', function() {
      assert.equal(true, filter.extract(req, data, params));
    });

    it('should be assigned after ', function() {
      assert.equal(100, data.a);
      assert.equal(200, data.b);
      assert.equal(300, data.d);
      assert.equal(3, filter.count(data));
    });
  });

  describe('#validate()', function() {
    it('should enabled validate string with length limite', function() {
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
      var error = {};

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
      assert.equal(false, filter.validate(params1, confs, error));
      assert.equal(false, filter.validate(params1, confs));
      assert.equal(true, params1[error.key] === params1.k1);
      assert.equal(true, error.reason === 'Not validate key k1');

      assert.equal(false, filter.validate(params2, confs2, error));
      assert.equal(true, params2[error.key] === params2.k2);
      assert.equal(true, error.reason === 'Not validate key k2');

      assert.equal(true, filter.validate(params3, confs3, error));
      assert.equal(false, error.key === 'k3');
      assert.equal(false, error.reason === 'Not validate key k3');
    });

    it('should validate mobile phone numbers', function() {
      var params1 = {
        k1: '13581723443'
      };
      var confs = {
        k1: {
          type: 'phone',
          locale: 'zh-CN'
        }
      };
      var error = {};

      assert.equal(true, filter.validate(params1, confs, error));
      assert.equal(false, error.key === 'k1');
      assert.equal(false, error.reason === 'Not validate key k1');

      var params2 = {
        k2: 'aaaa'
      };
      var confs2 = {
        k2: {
          type: 'phone',
          locale: 'zh-CN'
        }
      };
      assert.equal(false, filter.validate(params2, confs2, error));
      assert.equal(true, error.key === 'k2');
      assert.equal(true, error.reason === 'Not validate key k2');
    });

    it('should validate matches', function() {
      var params1 = {
        k1: '13581723443',
        k2: '13581723443'
      };
      var confs = {
        k2: {
          matches: 'k1'
        }

      };
      var error = {};

      assert.equal(true, filter.validate(params1, confs, error));
      assert.equal(false, error.key === 'k1' || error.key === 'k2');
      assert.equal(false, error.reason === 'Not validate key k1');
      assert.equal(false, error.reason === 'Not validate key k2');

      var params2 = {
        k1: '13581723443',
        k2: 'aaaa'
      };
      var confs2 = {
        k2: {
          matches: 'k1'
        }
      };
      assert.equal(false, filter.validate(params2, confs2, error));
      assert.equal(true, error.key === 'k2');
      assert.equal(false, error.reason === null);
    });

    it('should validate required', function() {
      var params1 = {
        k1: '13581723443'
      };
      var confs = {
        k1: {
          required: true
        }
      };
      var error = {};

      assert.equal(true, filter.validate(params1, confs, error));
      assert.equal(false, error.key === 'k1');
      assert.equal(false, error.reason === 'Not validate key k1');

      params1.k1 = undefined;
      assert.equal(false, filter.validate(params1, confs, error));
      assert.equal(true, error.key === 'k1');
      assert.equal(true, error.reason === 'Key ' + error.key + ' is undefined');

      params1.k1 = null;
      assert.equal(false, filter.validate(params1, confs, error));
      assert.equal(true, error.key === 'k1');
      assert.equal(true, error.reason === 'Key ' + error.key + ' is NULL');
    });

    it('should validate many params together', function() {
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

      assert.equal(true, filter.validate(params1, confs, error));
      assert.equal(false, error.key === 'k1');
      assert.equal(false, error.reason === 'Not validate key k1');
    });

    it('should validate matches', function() {
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
      var error = {};

      assert.equal(false, filter.validate(params1, confs, error));
      assert.equal(true, error.key === 'k2');
      assert.equal(true, error.reason === 'Not match key k1');
    });

    it('should not validate arrays', function() {
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
      var error = {};
      var result = filter.validate(params1, confs, error);

      assert.equal(false, result);
      assert.equal(true, error.reason === 'Params must not be an Array!');
    });
  });

  it('should not validate integer as string', function() {
    var params1 = {
      k1: 1
    };
    var confs = {
      k1: {

        type: 'string',
        required: true
      }
    };
    var error = {};
    assert.equal(false, filter.validate(params1, confs, error));
  });

  it('should validate string', function() {
    var params1 = {
      k1: '1'
    };
    var confs = {
      k1: {

        type: 'string',
        required: true
      }
    };
    var error = {};

    assert.equal(true, filter.validate(params1, confs, error));
  });

  describe('#result()', function() {
    it('should validate', function() {
      var req1 = {
        body: {
          k1: '13181715210',
          k2: '13181715210',
          k3: 'http://www.sina.com',
          k5: '10:00',
          k6: '24:00',
          k7: '00:19',
          k8: '19:59',
          k9: '24:00:00',
          k10: '23:59:59',
          k11: '1:19',
          k12: '1:00'

        }
      };
      var confs = {
        k1: {
          alias: 'phone',
          type: 'phone',
          locale: 'zh-CN'

        },
        k2: {
          matches: 'k1'
        },
        k3: {
          type: 'url'
        },
        k4: {
          ignore: true
        },
        k5: {
          type: 'time'
        },
        k6: {
          type: 'time'
        },
        k7: {
          type: 'time'
        },
        k8: {
          type: 'time'
        },
        k9: {
          type: 'time'
        },
        k10: {
          type: 'time'
        }
      };
      var validator = filter;
      var data1 = {};
      var error = {};
      var result = validator.v(req1, confs, data1, error);
      assert.equal(true, result);
      assert.equal(true, data1.phone === '13181715210');
      assert.equal(true, data1.k3 === 'http://www.sina.com');
      assert.equal(true, Boolean(data1.k2));
      assert.equal(true, data1.k4 === undefined);
      assert.equal(true, data1.k5 === '10:00');
    });

    it('should validate', function() {
      var req1 = {
        params: {
          k1: '13181715210',
          k2: '13181715210',
          k3: 'http://www.sina.com',
          k5: '10:00',
          k6: '24:00',
          k7: '00:19',
          k8: '19:59',
          k9: '24:00:00',
          k10: '23:59:59',
          k11: '1:19',
          k12: '1:00'

        }
      };
      var confs = {
        k1: {
          alias: 'phone',
          type: 'phone',
          locale: 'zh-CN'

        },
        k2: {
          matches: 'k1'
        },
        k3: {
          type: 'url'
        },
        k4: {
          ignore: true
        },
        k5: {
          type: 'time'
        },
        k6: {
          type: 'time'
        },
        k7: {
          type: 'time'
        },
        k8: {
          type: 'time'
        },
        k9: {
          type: 'time'
        },
        k10: {
          type: 'time'
        }
      };
      var validator = filter;
      var data1 = {};
      var error = {};
      var result = validator.v(req1, confs, data1, error, 'params');
      assert.equal(true, result);
      assert.equal(true, data1.phone === '13181715210');
      assert.equal(true, data1.k3 === 'http://www.sina.com');
      assert.equal(true, Boolean(data1.k2));
      assert.equal(true, data1.k4 === undefined);
      assert.equal(true, data1.k5 === '10:00');
    });

    it('should extra json', function() {
      var req1 = {
        k1: '13181715210',
        k2: '13181715210',
        k3: 'http://www.sina.com',
        k5: '10:00',
        k6: '24:00',
        k7: '00:19',
        k8: '19:59',
        k9: '24:00:00',
        k10: '23:59:59',
        k11: '1:19',
        k12: '1:00'
      };
      var confs = {
        k1: {
          alias: 'phone',
          type: 'phone',
          locale: 'zh-CN'
        },
        k2: {
          matches: 'k1'
        },
        k3: {
          type: 'url'
        },
        k4: {
          type: 'time'
        }
      };
      var validator = filter.json;
      var data1 = validator.extract(req1, confs);
      assert.equal(true, data1.phone === '13181715210');
      assert.equal(true, data1.k3 === 'http://www.sina.com');
      assert.equal(true, Boolean(data1.k2));
      assert.equal(true, data1.k4 === undefined);
      assert.equal(true, data1.k5 === undefined);
    });

    it('should validate objects', function() {
      var req1 = {
        k1: {
          kk1: 'hello',
          kk2: {
            kk3: 1,
            kk4: {
              kk5: 'http://www.sina.com',
              kk6: '13581725228'
            }
          }
        },
        k12: '1:00'
      };
      var confs = {
        k1: {
          type: 'object',
          validate: {
            kk1: {
              type: 'string'
            },
            kk2: {
              type: 'object',
              validate: {
                kk3: {
                  type: 'number'
                },
                kk4: {
                  type: 'object',
                  validate: {
                    kk5: {
                      type: 'url',
                      required: true
                    },
                    kk6: {
                      type: 'phone',
                      alias: 'phone',
                      locale: 'zh-CN'
                    }
                  }
                }
              }
            }
          }
        },

        k12: {
          type: 'time'
        }
      };
      var validator = filter.json;
      var data1 = validator.extract(req1, confs);
      assert.deepEqual(data1, req1);
    });

    it('should validate enumerators', function() {
      var req1 = {
        k12: 'hello'
      };
      var confs = {
        k12: {
          type: 'enum',
          enums: ['hello', 'sind', 'meo']
        }
      };
      var validator = filter.json;
      var errors = {};
      assert(filter.validate(req1, confs, errors));
      var data1 = validator.extract(req1, confs);
      assert.deepEqual(data1, req1);
    });

    it('should validate enumerators', function() {
      var req1 = {
        k12: 'sososs'
      };
      var confs = {
        k12: {
          type: 'enum',
          enums: ['hello', 'sind', 'meo']
        }
      };
      var errors = {};
      assert(!filter.validate(req1, confs, errors));
    });
  });
});
