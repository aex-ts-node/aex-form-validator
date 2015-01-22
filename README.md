sails-params
============

params extraction for sails

```javascript

//Inside sails controller
module.exports = {
  add: function (req, res) {

    var filter = require("sails-params");

    var params = [
      {name: 'key', alias: 'alias'},
      'key1'
    ];
    var data = {};

    if (!filter.extract(req, data, params)) {
      return false;
    }
    
    //You will have
    //data.alias
    //data.key1
    //assigned

  }
}

```

params validation


```javascript

var params = {
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

      assert.equal(true, filter.validate(params, confs, error));
      assert.equal(false, error.key == 'k1');
      assert.equal(false, 'Not validate key k1' == error.reason);
      
    ```
