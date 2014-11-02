module.exports = {

  extract: function (req, data, params) {
    if (!params || !params.length || !data || !req || !req.param) {
      return false;
    }

    for(var i = 0; i < params.length; i++) {
      var k = params[i];
      var type = typeof k;
      switch(type) {
        case 'string':
          var v = req.param(k);
          if (v) {
            data[k] = v;
          }
          break;
        case 'object':
          var v = req.param(k.name);
          if (v) {
            data[k.alias] = v;
          }
      }
    }
    return true;
  }
};
