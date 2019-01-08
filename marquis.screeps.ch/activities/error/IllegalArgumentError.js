
/**
 * Thrown when a required argument is invalid from a function/constructor call.
 *
 * @extends {Error}
 */
class IllegalArgumentError extends Error {
    /**
     * @param {string} message - A message.
     */
    constructor(message) {
        super(message);
        this.name = 'IllegalArgumentError';
    }
};
