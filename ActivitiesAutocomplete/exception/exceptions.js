
/**
 * Thrown when trying to send a message without receiverID.
 *
 * @extends {Error}
 */
function MissingReceiverIDError() {};
MissingReceiverIDError.prototype = Error.prototype;

/**
 * Thrown when an internal state error is encountered.
 *
 * @extends {Error}
 *
 * @param {string} message - A message.
 */
function InternalStateError(message) {};
InternalStateError.prototype = Error.prototype;

/**
 * Thrown when a required argument is missing from a function/constructor call.
 *
 * @extends {Error}
 *
 * @param       {string} message - A message.
 */
function MissingArgumentError(message) {};

/**
 * Thrown when a caller of MessageUtil#create
 * does not provide a message constant.
 *
 * @extends {MissingArgumentError}
 *
 * @param  {string} text - Text of the Message object.
 */
function MissingMessageConstantError(text) {};
MissingMessageConstantError.prototype = MissingArgumentError.prototype;
