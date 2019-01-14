
/**
 * Thrown when a required argument is missing from a function/constructor call.
 *
 * @augments Error
 * @memberof module:error
 */
class MissingArgumentError extends Error {
    /**
     * @param {Error} error - Must be an error to preserve the original stack.
     */
    constructor(error) {
        super(error.message);
        this.stack = error.stack;
        this.name = 'MissingArgumentError';
    }
}
