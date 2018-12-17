
/**
 * Thrown when a required argument is invalid from a function/constructor call.
 *
 * @extends {Error}
 *
 * @param {string} message - A message.
 */
class IllegalArgumentError extends Error {
    constructor(message) {
        super(message);
        this.name = 'IllegalArgumentError';
    }
};
