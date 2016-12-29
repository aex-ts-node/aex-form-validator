module.exports = function (data, conf) {
  if (!conf.enums) {
    return false;
  }
  if (!(conf.enums instanceof Array)) {
    return false;
  }
  return conf.enums.indexOf(data) !== -1;
};

