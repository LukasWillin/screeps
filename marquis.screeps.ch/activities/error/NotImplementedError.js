
/**
 * Error thrown when Method not implemented.
 * Like from an interface or abstract class.
 * 
 * @augments Error
 * @memberof module:error
 */
class NotImplementedError extends Error {
    /**
     * @param {Error} error - Must be an error to preserve the original stack. 
     */
    constructor(error) {
        super(error.message);
        this.stack = error.stack;
        this.name = 'NotImplementedError';
    }
}
