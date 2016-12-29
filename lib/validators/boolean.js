module.exports = function (data) {
  var type = typeof data;
  if (type === 'string') {
    return ['true', 'false'].indexOf(data.toLowerCase()) !== -1;
  }
  if (type === 'boolean') {
    return true;
  }
  return false;
};
