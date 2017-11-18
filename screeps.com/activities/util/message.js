
var MessageUtil = {	identifier: 'MemoryUtil',

	create: function(mConstant, text, data, returning) {
		if(mConstant === undefined || mConstant === null)
			throw new MissingMessageConstantError(text);

		if(_.isUndefinedOrNull(returning) || returning === false) {
			return new Message(mConstant, text, data);

		} else if(returning === true) {
			return new ReturnMessage(mConstant, text, data);

		} else {
			throw new InternalStateError("Internal error creating new message. Maybe you tried setting param <returning> to anything else but boolean?");
		}
	},

	send: function(senderID, receiverID, message) {
		if(_.isUndefinedOrNull(senderID))
			throw new MissingArgumentError("ID for sender required.");
		if(_.isUndefinedOrNull(receiverID))
			throw new MissingArgumentError("ID for receiver required.");
		if(_.isUndefinedOrNull(message))
			throw new MissingArgumentError("A message must be provided.");

		message.receiverID = receiverID;
		message.senderID = senderID;

		var receiversMessages = this._messages[receiverID];
		if(_.isUndefinedOrNull(receiversMessages))
			this._messages[receiverID] = receiversMessages = [];

		receiversMessages.push(messages);
	},

	receive: function(receiverID) {
		var receivedMessages = this._messages['receiverID'];
		return (!_.isUndefinedOrNull(receivedMessages) && !_.isEmpty(receivedMessages))
		 					? receivedMessages : null;
	},

	_mem: (function() {
		return MemoryUtil.getMemory(identifier, {package: MemoryUtil.PACKAGE.UTIL});
	})(),

	/**
	 * Set of receivers and messages.
	 * @type {Map<receiverID, Array<Message>>}
	 */
	_messages: (function() {
		var msgs = _mem['messages'];
		return (!_.isUndefinedOrNull(msgs)) ? msgs : {};
	})(),

	MSG_CONST: {

	}
};

var Message = function(mConstant, text, data) {
	if(_.isUndefinedOrNull(mConstant))
		throw new MissingArgumentError("A constant must be provided with the message.");
	this.constant = mConstant;

	this.text = !_.isUndefinedOrNull(text) ? text : undefined;
	this.data = !_.isUndefinedOrNull(data) ? data : undefined;

	this.timestamp = Game.time;
};

var ReturnMessage = function(mConstant, text, data) {
	if(_.isUndefinedOrNull(mConstant))
		throw new MissingArgumentError("A constant must be provided with the message.");
	this.constant = mConstant;

	this.text = !_.isUndefinedOrNull(text) ? text : undefined;
	this.data = !_.isUndefinedOrNull(data) ? data : undefined;

	this.timestamp = Game.time;
};

module.exports = MessageUtil;
