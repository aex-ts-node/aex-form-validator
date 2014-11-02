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
