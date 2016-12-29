module.exports = function (data, conf, max) {
  if (typeof data !== 'string') {
    return -1;
  }
  if (conf.minLength && data.length < conf.minLength) {
    return -2;
  }
  if (conf.maxLength && data.length > conf.maxLength) {
    return -3;
  }
  if (max) {
    if (data.length > max) {
      return -4;
    }
  }
  return true;
};
