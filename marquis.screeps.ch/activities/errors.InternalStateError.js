
/**
 * Thrown when an internal state error is encountered.
 *
 * @extends {Error}
 *
 * @param {string} message - A message.
 */
class InternalStateError extends Error {
    constructor(message) {
        super(message);
        this.name = 'InternalStateError';
    }
};
