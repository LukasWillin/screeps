
/**
 * The log util enables logging into the memory.
 * @type {Object}
 */
var LogUtil = {

	/**
	 * Creates a log entry message object and stores it in memory as string.
	 *
	 * @param  {Object} entry A log entry object.
	 *  @property {number} timeStamp - Game time at log entry creation.
	 *  @property {string} type - An exception name or other appropriate descriptive type name.
	 *  @property {string} message - A message describing the matter of this entry.
	 */
	log: function(entry) {

		this._logs.push(Json.stringify(entry));

		// TODO parametrize the log size (length)
	 	while(this._logs.length > 100) {
			this._logs.shift();
		}
	},

	_mem: (function() {
		return MemoryUtil.getMemory("LogUtil", {package: MemoryUtil.PACKAGE.UTIL})
	})(),

	_logs: (function() {
		var logsRef = _mem['logs'];
		if(logsRef === null || logsRef === undefined) {
			logsRef = _mem['logs'] = [];
		}
		return = logsRef;
	}),

	writeToConsole: function() {
		var out = "";
		for(var i = 0; i < _logs.length; i++) {
			out = out.concat("\n" + logs[i]);
		}
		console.log();
	}
};

module.exports = LogUtil;
