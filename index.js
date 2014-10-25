module.exports = {

  extract: function (req, data, params) {
    if (!params || !params.length || !data || !req || !req.param) {
      return false;
    }

    for(var i = 0; i < params.length; i++) {
      var k = params[i];
      var v = req.param(k);
      if (v) {
        data[k] = v;
      }
    }
    return true;
  }
};
