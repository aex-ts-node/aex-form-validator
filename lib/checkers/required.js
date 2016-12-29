var validator = require('validator');
module.exports = function (param, k, error) {
  if (param === undefined) {
    error.message = 'Key ' + k + ' is undefined';
    return error;
  }
  if (param === null) {
    error.message = 'Key ' + k + ' is NULL';
    return error;
  }
  if (typeof param === 'string' && (validator.isEmpty(param) || !validator.isLength(param, 1))) {
    error.message = 'Key ' + k + ' is NULL';
    return error;
  }
  return false;
};
