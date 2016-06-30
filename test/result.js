var assert = require('assert');
var filter = require('../lib/index');
describe('#result()', function () {
  it('should validate', function () {
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
    var result = filter.validate(req1, confs);
    assert.deepEqual({
      code: 0,
      message: 'Success',
      data: {
        phone: '13181715210',
        k2: '13181715210',
        k3: 'http://www.sina.com',
        k5: '10:00',
        k6: '24:00',
        k7: '00:19',
        k8: '19:59',
        k9: '24:00:00',
        k10: '23:59:59'
      }
    }, result);
  });

  it('should validate', function () {
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
    var result = validator.validate(req1, confs);
    assert.deepEqual({
      code: 0,
      message: 'Success',
      data: {
        phone: '13181715210',
        k2: '13181715210',
        k3: 'http://www.sina.com',
        k5: '10:00',
        k6: '24:00',
        k7: '00:19',
        k8: '19:59',
        k9: '24:00:00',
        k10: '23:59:59'
      }
    }, result);
  });

  it('should extra json', function () {
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
    var params = filter._getParams(confs);
    var data1 = filter.extract(req1, params);
    assert.equal(true, data1.phone === '13181715210');
    assert.equal(true, data1.k3 === 'http://www.sina.com');
    assert.equal(true, Boolean(data1.k2));
    assert.equal(true, data1.k4 === undefined);
    assert.equal(true, data1.k5 === undefined);
  });

  it('should validate objects', function () {
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
    var params = filter._getParams(confs);
    var data1 = filter.extract(req1, params);
    assert.deepEqual(data1, req1);
  });

  it('should validate enumerators', function () {
    var req1 = {
      k12: 'hello'
    };
    var confs = {
      k12: {
        type: 'enum',
        enums: ['hello', 'sind', 'meo']
      }
    };
    assert(filter._validate(req1, confs));
    var params = filter._getParams(confs);
    var data1 = filter.extract(req1, params);
    assert.deepEqual(data1, req1);
  });

  it('should not validate enumerators', function () {
    var req1 = {
      k12: 'sososs'
    };
    var confs = {
      k12: {
        type: 'enum',
        enums: ['hello', 'sind', 'meo']
      }
    };
    assert.deepEqual({
      code: -1,
      key: 'k12',
      message: 'Not validate key k12'
    }, filter._validate(req1, confs));
  });
});
