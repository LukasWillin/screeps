
var ActivityScheduler = {

	identifier: 'ActivityScheduler',

	run: function() {
		this._schedule();
	},

	register: function(activityID) {
	},

	_schedule: function() {

	},

	_executeActivties: function() {

	},

	_mem: (function() {
		return MemoryUtil.getMemory(identifier, {
			package: MemoryUtil.PACKAGE.UTIL;
		});
	})(),

	_activityList: (function() {
		if(_mem['activityList'] === undefined || _mem['activityList'] === null)
			_mem['activityList'] = [];
		return _mem['activityList'];
	})()
};

module.exports = ActivityScheduler;
