
/**
 * Thrown when a required argument is missing from a function/constructor call.
 *
 * @param {Error} error - An error to extend.
 */
class MissingArgumentError
{
    constructor(error) 
    {
        error.name = 'MissingArgumentError';
        return error;
    }
}

module.exports = MissingArgumentError;