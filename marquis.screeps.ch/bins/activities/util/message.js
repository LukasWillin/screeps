
var MessageUtil = {	identifier: 'MessageUtil',

	create: function(mConstant, text, data, returning) {
		return new Message(mConstant, text, data, returning);
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

		_messagesByReceiver(receiverID).push(messages);
	},

	receive: function(receiverID) {
		var receivedMessages = _messagesByReceiver(receiverID);
        _messages[receiverID] = undefined;
        return (!_.isUndefinedOrNull(receivedMessages)) ? receivedMessages : [];
	},

    /**
     * Get messages by a receiver ID.
     * @param  {string} receiverID [description]
     * @return {[type]}            [description]
     */
    _messagesByReceiver(receiverID) {
        var receiversMessages = this._messages[receiverID];
		if(_.isUndefinedOrNull(receiversMessages))
			this._messages[receiverID] = receiversMessages = [];
        return receiversMessages;
    }
};
Object.defineProperties(MessageUtil, {

    /**
     * The memory object for the MemoryUtil.
     * @private
     * @type {Object}
     */
    '_mem': {
        get: function _memGetter() {
            if (_.isUndefined(_memGetter._mem))
                _memGetter._mem = MemoryUtil.getMemory(identifier, { package: MemoryUtil.PACKAGE.UTIL });
            return _memGetter._mem;
        }
    },

    /**
	 * Set of receiver IDs and messages.
	 * @private
	 * @type {Map<string, Array<Message>>}
	 */
	'_messages': {
        get: function _messagesGetter() {
            if (_.isUndefinedOrNull(_messagesGetter._msgs))
                _messagesGetter._msgs = _mem['messages'] = {};
    		return _messagesGetter._msgs;
    	}
    }
});

class Message {
    constructor(mConstant, text, data, returning) {

        if (_.isUndefinedOrNull(mConstant))
    		throw new MissingArgumentError("A constant must be provided with the message.");
    	this.constant = mConstant;

    	this.text = !_.isUndefinedOrNull(text) ? text : undefined;
    	this.data = !_.isUndefinedOrNull(data) ? data : undefined;

        this.return = returning;
        this.returnTo = null;

        this.senderID = null;
        this.receiverID = null;

    	this.timestamp = Game.time;
    }
}
Object.defineProperties(Message, {
    CONSTANTS: {
        // TODO: Define Message Constants
    }
});

module.exports = MessageUtil;
