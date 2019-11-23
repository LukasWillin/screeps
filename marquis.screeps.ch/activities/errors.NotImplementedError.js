
/**
 * Error thrown when Method not implemented.
 *
 * @param {Error} error - An error to extend.
 */
class NotImplementedError
{
    constructor(error)
    {
        error.name = 'NotImplementedError';
        return error;
    }
}

module.exports = NotImplementedError;