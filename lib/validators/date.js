module.exports = function (str) {
  if (typeof str !== 'string') {
    return false;
  }
  var parsed = new Date(Date.parse(str));
  if (isNaN(parsed)) {
    return false;
  }
  return true;
};
