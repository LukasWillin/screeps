/**
 * Thrown when an internal state error is encountered.
 *
 * @param {Error} error - An error to extend.
 */
class InternalStateError
{
    constructor(error)
    {
        error.name = 'InternalStateError';
        return error;
    }
}

module.exports = InternalStateError;
