
/**
 * Thrown when a required argument is missing from a function/constructor call.
 *
 * @extends {Error}
 *
 * @param {string} message - A message.
 */
class MissingArgumentError extends Error {
    constructor(message) {
        super(message);
        this.name = 'MissingArgumentError';
    }
};
