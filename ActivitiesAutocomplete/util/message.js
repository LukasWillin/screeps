
/**
 * The message util enables objects to send and receive messages
 * and/or data in a consistent and reliable way.
 * @class
 */
MessageUtil = {

	/**
	 * Creates a new message.
	 * Note that the message won't be stored and is therefore not receivable.
	 * Use #send to make the message receivable via #receive.
	 *
	 * @type {function}
	 *
	 * @param  {number} mConst A message constant. A message constant should be
	 * 												 defined somewhere with a documentation. :required
	 * 												 If a constant is specific to some class it might
	 * 												 makes sense to defined it there directly.
	 * @param  {string} text   Any kind of message.
	 * @param  {Object<string, any} data  An arbitrary container for data.
	 * @return {Message}       A Message object.
	 */
	create: function(mConstant, text, data) {},

	/**
	 * This method will store the message so the receiver can
	 * obtain it by calling #receive
	 *
	 * @static
	 * @type {function}
	 *
	 * @param {String} senderID - ID of the sender. :required
	 * @param {String} receiverID - ID of the receiver. :required
	 *
	 * @throws {MissingArgumentError} - If IDs for sender and receiver are missing.
	 */
	send: function(senderID, receiverID, message) {},

	/**
	 * Get all messages for the receiverID. All returned messages are removed
	 * from the message container.
	 *
	 * @static
	 * @type {function}
	 *
	 * @param  {string} receiverID ID of the receiver.
	 * @return {Array<Message>}    An Array of messages. Or undefined if receiver ID not provided.
	 */
	receive: function(receiverID) {}
};

/**
 * Constructs a new message.
 * A constant value is required to identify the type of the message.
 * Sender and receiver ID are initialized with empty strings.
 * @class
 *
 * @param {number} mConstant - A constant specifying the type of the message.
 * @param {string} text - A message text.
 * @param {Object} data - An arbitrary data container.
 * @param {boolean} returning - Specifies the message to be a return message.
 */
Message = function(mConstant, text, data) {};
Message.prototype = {

	/**
	 * ID of the sender.
	 * @property
	 * @type {string}
	 */
	senderID: "",

	/**
	 * ID of the receiver.
	 * @property
	 * @type {string}
	 */
	receiverID: "",

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

/**
 * Special Message. Used to return data froma function/method.
 * @class
 * @extends Message
 */
ReturnMessage = Message;
ReturnMessage.prototype = Message.prototype;
