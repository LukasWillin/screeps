/**
 * An activity is a little bit like a process in a computer system. Its a standardized way
 * for the scheduler to do his work.
 * An activity contains information about the progress of a task and additional information
 * such as the room which created it allow for prioritization of the activity.
 * The Activity object contains a lot of constants that are used to pass the activity
 * and optional arguments to the handling objects such as a creep.
 * There is a special constant which allows the creator to let an activity be handled differently
 * then the standard allows. Which is the number 0. Like so a custom function can be set.
 * Some activities can be static and require a custom function. Static activities
 * dont have progression and are called as long as the handler exists.
 * @type {Object}
 */
var Activity = {

	/** Creates a new UNMANAGED activity that which be managed manually.
	* The custom method must be like the following:
	*    cMethod(argsByCopy, dataByRef)
	*
	* @param  {Object} args - Arguments by object.
	*    @property {string} roomID - ID of the room which is considered the execution environment.
	*    @property {string} hostID - ID of the host on which the activity is executed.
	*    @property {Object} execArgs - Arguments that will be handed to the host by value.
	*    @property {Object} data - Data container object that is handed to the host by reference.
	*    @property {number} type - A type constant.
	*    @property {string} customMethod - Method name of a custom method if type constant is ANY.
	 */
	create: function( args ) { //type, roomID, hostID, args, customMethod, execInterval, data) {

		return new function( args ) {}//type, roomID, hostID, args, customMethod, execInterval, data) {
			this.type = args.type;

			this.ID = Activity._getNewId();

			this.data = args.data;
			if(args.data === undefined || args.data === null)
				this.data = {};

			this.hostID = hostID;

			this.execArgs = args.execArgs;

			this.progressPercent = 0;

			// this.cpuTime = -1; // Scheduler must implement its own method to track this kind of information

			this.creationTime = Game.time;

			this.roomID = args.roomID;

			this.customMethodName = args.customMethodName;

			// this.states = [Activity.STATE.CREATED]; // Scheduler must implement its own method to track this kind of information

		} /* Dont forget to update the call as well. */ ( args ); //type, roomID, hostID, args, customMethod, execInterval, data);

	},

	// --- CONSTANTS ---

	/** Constants that specify the type of an activity.
	 * Use the constant number to access other constants related to the type.
	 * @static
	 * @property {Object}
	 * 		@constant {number}
	 */
	TYPE: {
		/** A non specific type indicating that customMethod should be used.
		 * @type {Number}
		 */
		CUSTOM: 0,
		BUILD: 1,
		REPAIR: 2,
		REPLENISH: 3
	},

	/** Constants that specify required hosts (Objects able to perform the activity).
	 * Together with the STATE constants it should allow for better prioritization of activities.
	 * @static
	 * @property {Object}
	 * 		@constant {string[]}
	 */
	REQUIRED_HOST: {
		'1': ["creep"],
		'2': ["creep", "tower"],
		'3': ["creep"]
	},

	/** Constants specifying required resources for the activity type.
	 * Together with the STATE constant it should allow for better prioritization of activities.
	 * @static
	 * @property {Object}
	 * 		@constant {string[]}
	 */
	REQUIRED_RESOURCE: {
		'1': ["energy"],
		'2': ["energy"],
		'3': ["energy"]
	},

	/** Constants specifying methods the host has to implement for the activity type.
	 * @static
	 * @property {Object}
	 * 		@constant {string} Name of the method required.
	 */
	REQUIRED_HOST_METHOD: {
		/** Use the custom function name stored in the activity object
		 * and try calling it on the object. */
		'0': "customMethod",
		'1': "build",
		'2': "repair",
		'3': "replenish"
	},

	/** The global memory property of this Class.
	 * @static
	 * @property
	 */
	glbMem: (function() {
		return MemoryUtil.getMemory(MemoryUtil.SECURITY.GLOBAL, "activity");
	})(),

	/** Creates a new ID for activities.
	 * @static
	 * @private
	 */
	_getNewId: function() {
		if(Activity.glbMem.lastId === undefined)
			Activity.glbMem.lastId === 0;
		Activity.glbMem.lastId += 1;
		return ( Activity.glbMem.lastId * 10000 ) + (Math.floor( Math.random() * 10000 ));
	}
};

module.exports = Activity;

/*

** Constants defining a progress percentage.
 * Theses constants should allow for easier prioritization.
 * @static @type {Object}
 * 		@property @constant {number}
 *
PROGRESS: {
	DONE: 100,

	NEARLY: 95,
	FINISH_UP: 85,

	FOURTH_QUARTER: 75,

	HALF_DONE: 50, THIRD_QUARTER: 50,

	SECOND_QUARTER: 25,

	BUILD_UP: 5,
	STARTED: 0, FIRST_QUARTER: 0,
	NONE: -1,
	** Indicates that the activity is static and wont have any progress.
	 * E.G. a roomID that wants to have some of its functions called as long as he exists
	 * declares the activity for this particular function static.
	 * @type {number}
	 *
	STATIC: -10
},

** Returns the state of the activity
 *	@param {boolean} quartersOnly - When false will return more precise state descriptions. When true will return quarter values.
 *	@return {number} One of the PROGRESS state constants.
 *
getProgress: function(activity, quartersOnly) {

	if(activity.progressPercent >= Activity.PROGRESS.DONE) return Activity.PROGRESS.DONE;

	if(quartersOnly) {
		if(activity.progressPercent >= Activity.PROGRESS.FOURTH_QUARTER) return Activity.PROGRESS.FOURTH_QUARTER;
		if(activity.progressPercent >= Activity.PROGRESS.THIRD_QUARTER) return Activity.PROGRESS.THIRD_QUARTER;
		if(activity.progressPercent >= Activity.PROGRESS.SECOND_QUARTER) return Activity.PROGRESS.SECOND_QUARTER;
		if(activity.progressPercent >= Activity.PROGRESS.FIRST_QUARTER) return Activity.PROGRESS.FIRST_QUARTER;

	} else {
		if(activity.progressPercent >= Activity.PROGRESS.DONE) return this.PROGRESS.DONE;
		if(activity.progressPercent >= Activity.PROGRESS.NEARLY) return Activity.PROGRESS.NEARLY;
		if(activity.progressPercent >= Activity.PROGRESS.FINISH_UP) return Activity.PROGRESS.FINISH_UP;
		if(activity.progressPercent >= Activity.PROGRESS.FOURTH_QUARTER) return Activity.PROGRESS.FOURTH_QUARTER;
		if(activity.progressPercent >= Activity.PROGRESS.HALF_DONE) return Activity.PROGRESS.HALF_DONE;
		if(activity.progressPercent >= Activity.PROGRESS.SECOND_QUARTER) return Activity.PROGRESS.SECOND_QUARTER;
		if(activity.progressPercent >= Activity.PROGRESS.BUILD_UP) return Activity.PROGRESS.BUILD_UP;
		if(activity.progressPercent >= Activity.PROGRESS.STARTED) return Activity.PROGRESS.STARTED;
	}

	if(activity.progressPercent === Activity.PROGRESS.STATIC) return Activity.PROGRESS.STATIC;
	if(activity.progressPercent >= Activity.PROGRESS.NONE) return Activity.PROGRESS.NONE;
},

** @deprecated The scheduler must provide its own logik to track states
 * Constants defining the state of an activity.
 * These should allow for easier prioritization of activities.
 * @static @type {Object}
 *    @property @constant {number}
 *
*STATE: {
	CREATED: -1
	READY_TO_RUN: 1,
	WAITING_FOR_HOST: 2,
	WAITING_FOR_RESOURCE: 3,
	WAITING_FOR_OTHER_ACTIVITY: 4
},*
 */
