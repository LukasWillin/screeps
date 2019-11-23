const _isNull = require('lodash/isNull');
const _isUndefined = require('lodash/isUndefined');

module.exports = function(value) {
    return _isUndefined(value) || _isNull(value);
}