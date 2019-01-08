
/**
 * Thrown when an internal state error is encountered.
 *
 * @extends {Error}
 */
class InternalStateError extends Error {
    /**
     * 
     * @param {Error} error - Must be an error to preserve the original stack.
     */
    constructor(error) {
        super(error.message);
        this.stack = error.stack;
        this.name = 'InternalStateError';
    }
};
