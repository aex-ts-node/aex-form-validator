
var assert = require("assert")
describe('sails-params', function(){
  var filter =  require('./index');
  var req = {
    data: {
      'a': 100,
      'b': 200,
      'c': 300
    },
    param: function(k) {
      return req.data[k];
    }
  };


  var params = ['a', 'b', {name: 'c', alias: 'd'}];

  var data = {};

  describe('#extract()', function(){
    it('should return false when the req is not present', function(){
      assert.equal(false, filter.extract(null, data, params));
    });

    it('should return false when the data is not present', function(){
      assert.equal(false, filter.extract(req, null, params));
    });

    it('should return false when the params is not present', function(){
      assert.equal(false, filter.extract(req, data, null));
    });

    it('should return true when all the params are present', function(){
      assert.equal(true, filter.extract(req, data, params));
    });

    it('should be assigned after ', function(){
      assert.equal(100,  data.a);
      assert.equal(200,  data.b);
      assert.equal(300,  data.d);
    })
  })
})


