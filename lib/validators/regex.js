module.exports = function (data, conf) {
  return conf.regex && conf.regex.test && conf.regex.test(String(data));
};
