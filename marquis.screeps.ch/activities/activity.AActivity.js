const IActivity = require('./activity.IActivity');
const ObjectSystem = require('./object.System');
const Scheduler = require('./activity.Scheduler');

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
class AActivity extends IActivity {

    constructor(args) {
        this.className = this.constructor.className;

        this.ID = AActivity.getNewId();

        this.data = args.data;
        if(args.data === undefined)
            this.data = null;

        this.hostID = hostID;

        this.execArgs = args.execArgs;

        this.progressPercent = 0; // This must be calculated by a static class function.

        // this.cpuTime = -1; // Scheduler must implement its own method to track this kind of information

        this.creationTimestamp = Game.time;

        this.roomID = args.roomID;

        // this.states = [Activity.STATE.CREATED]; // Scheduler must implement its own method to track this kind of information
    }

	/** Creates a new UNMANAGED activity that which be managed manually.
	 * The custom method must be like the following:
	 *    cMethod(argsByCopy, dataByRef)
	 *
	 * @param  {Object} args - Arguments by object.
	 *    @param {string} args.roomID - ID of the room which is considered the execution environment.
	 *    @param {string} args.hostID - ID of the host on which the activity is executed.
	 *    @param {Object} args.execArgs - Arguments that will be handed to the host by value.
	 *    @param {Object} args.data - Data container object that is handed to the host by reference.
	 *    @param {number} args.typeName - An activity type name.
	 */
	static create( args ) {
        return new this.constructor(args);
	}

    /**
     * A class instance shorthand method to its static run Method.
     * Does not need to be overridden as it accesses this.constructor#run.
     */
    run() {
        this.constructor.run(this);
    }

    static getNewId() {
        return ObjectSystem.getNewId(this.className);
    }
};

AActivity.className = 'AActivity';
AActivity.priority = 0;

Scheduler.addActivityClass(AActivity);

module.exports = AActivity;
