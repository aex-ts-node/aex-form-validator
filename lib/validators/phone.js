var validator = require('validator');
module.exports = function (data, conf) {
  return validator.isMobilePhone(data, conf.locale || 'zh-CN');
};

