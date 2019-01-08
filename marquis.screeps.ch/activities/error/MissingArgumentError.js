
/**
 * Thrown when a required argument is missing from a function/constructor call.
 *
 * @extends {Error}
 */
class MissingArgumentError extends Error {
    /**
     * 
     * @param {Error} error - Must be an error to preserve the original stack.
     */
    constructor(message) {
        super(message);
        this.name = 'MissingArgumentError';
    }
};
