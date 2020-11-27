
/**
 * Thrown when a required argument is invalid from a function/constructor call.
 *
 * @augments Error
 * @memberof module:error
 */
class IllegalArgumentError extends Error
{
    /**
     * @param {Error} error - A message.
     */
    constructor(error)
    {
        super(error.message);
        this.stack = error.stack;
        this.name = 'IllegalArgumentError';
    }
}

export = IllegalArgumentError;
