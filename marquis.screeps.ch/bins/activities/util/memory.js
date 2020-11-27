
const _has = require('lodash/has');
const _set = require('lodash/set');
const _get = require('lodash/get');
const _unset = require('lodash/unset');

/**
 * @see get
 */
module.exports = function memory(...args)
{
    return memory.get(...args);
};

/**
 * Gets the value from path in Memory.
 * If the path does currently not exist it is created according to lodash.set.
 * Per default a memory object is created at path.
 * @param {string} path - Path in Memory.
 * @param {*} [defaultValue] - Optional default value to set at path.
 */
module.exports.get = function (path, defaultValue = {})
{
    if (!_has(Memory, path))
        _set(Memory, path, defaultValue);

    return _get(Memory, path);
};

/**
 * Sets the value at path in Memory replacing any other value.
 * If the path does currently not exist it is created according to lodash.set.
 * Per default a memory object is created at path.
 * @param {string} path - Path in Memory.
 * @param {*} [value] - Optional value to set at path replacing any current value.
 */
module.exports.set = function (path, value = {})
{
    _set(Memory, path, value);
    return _get(Memory, path);
};

/**
 * Moves a memory value from an old path to a new one.
 * The operation is registered in "__mem__.[fromPath]>[toPath]" and only executed once.
 * Delete the registration if you wish to repeat the operation.
 * @param {string} fromPath - The current path in Memory.
 * @param {string} toPath - The destination path in Memory.
 * @param {*} defaultValue - The defaultValue if the  current path does not exist in Memory.
 */
module.exports.move = function (fromPath, toPath, defaultValue)
{
    if (_get(Memory, `__mem__.${fromPath}>${toPath}`) !== 1)
    {
        _set(Memory, `__mem__.${fromPath}>${toPath}`, 1);
        const oldValue = _get(Memory, fromPath, defaultValue);
        _unset(Memory, fromPath);
        _set(Memory, toPath, oldValue);
    }
};