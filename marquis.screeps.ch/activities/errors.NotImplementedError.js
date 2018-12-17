
/**
 * Error thrown when Method not implemented.
 * Like from an interface or abstract class.
 * @extends Error
 */
class NotImplementedError extends Error {
    constructor(message) {
        super(message);
        this.name = 'NotImplementedError';
    }
}
