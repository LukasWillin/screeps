
/**
 * The message util enables objects to send and receive messages
 * and/or data in a consistent and reliable way.
 * @class
 */
class MessageUtil {

	/**
	 * Creates a new message.
	 * Note that the message won't be stored and is therefore not receivable.
	 * Use #send to make the message receivable via #receive.
	 *
	 * @type {function}
	 *
	 * @param {number} mConst - A message constant. A message constant should be
	 * 	   defined somewhere with a documentation.
	 * 	   If a constant is specific to some class it might
	 * 	   makes sense to defined it there directly.
	 * @param {string} text - Any kind of message text.
	 * @param {Object<string, any} data (optional) - An arbitrary container for data.
	 * @param {boolean} returning (optional, default:false) - Create a message which expects
	 *     to be returned to the sender.
	 * @return {Message} - A Message object.
	 */
	create(mConstant, text, data, returning) { },

	/**
	 * This method will store the message so the receiver can
	 * obtain it by calling #receive
	 *
	 * @static
	 * @type {function}
	 *
	 * @param {string} senderID - ID of the sender.
	 * @param {string} receiverID - ID of the receiver.
	 *
	 * @throws {MissingArgumentError} - If IDs for sender and/or receiver are missing.
	 */
	send(senderID, receiverID, message) { },

	/**
	 * Get all messages for the receiverID. All returned messages are removed
	 * from the message container.
	 *
	 * @static
	 * @type {function}
	 *
	 * @param  {string} receiverID - ID of the receiver.
	 * @return {Array<Message>} - An Array of messages. Or undefined if receiver ID not provided.
	 */
	receive(receiverID) { }
};

/**
 * Constructs a new message.
 * A constant value is required to identify the type of the message.
 * Sender and receiver ID are initialized with empty strings.
 * @class
 *
 * @param {number} mConst - A message constant. A message constant should be
 * 	   defined somewhere with a documentation.
 * 	   If a constant is specific to some class it might
 * 	   makes sense to defined it there directly.
 * @param {string} text - Any kind of message text.
 * @param {Object<string, any} data (optional) - An arbitrary container for data.
 * @param {boolean} returning (optional, default:false) - Create a message which expects
 *     to be returned to the sender.
 */
Message = function(mConstant, text, data, returning) { };
Message.prototype = {

	/**
	 * ID of the sender.
	 * @property
	 * @type {string}
	 */
	senderID: null,

	/**
	 * ID of the receiver.
	 * @property
	 * @type {string}
	 */
	receiverID: null,

	/**
	 * A message constant from MessageUtil.MSG_CONST.
	 * An own constant can be used though it is recommended
	 * to specify it as a member of MessageUtil.MSG_CONST to
	 * prevent duplicates.
	 * @property
	 * @type {string}
	 */
	constant: "",

	/**
	 * Text of the message.
	 * @property
	 * @type {string}
	 */
	text: "",

	/**
	 * A data container for any data that must be sent with the message.
	 * Make sure the receiver knows what to do with it.
	 * @property
	 * @type {Object}
	 */
	data: {},

	/**
	 * The time when the message was created in ticks.
	 * @property
	 * @type {number}
	 */
	timestamp: 0
};
