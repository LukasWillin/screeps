/**
 * Thrown when a required argument is invalid from a function/constructor call.
 *
 * @param {Error} error - An error to extend.
 */
class IllegalArgumentError
{
    constructor(error) 
    {
        error.name = 'IllegalArgumentError';
        return error;
    }
}

module.exports = IllegalArgumentError;