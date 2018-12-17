

const NotImplementedError = require('./errors.NotImplementedError');

/**
 * An activity implements the logic to execute specific task(s).
 * The activity instance is just a memory object to contain state and information
 *  required to run / resume / end a ceratin task.
 * An activity will need to be assigned to requirements it requires. The IActivator will 
 *  reserve these resources for it if necessary. A resource can be everything from a 
 *  building to a creep or else. Though keep in mind the kernel has to be able to recognize
 *  them.
 * An activity does not need to be assigned to an ingame object/resources though.
 */
class IActivity {
    /**
     * Be able to run/resume the activity from memory state.
     * @param {Object} activityState - Its literally just an object from memory.
     * @returns {Object} - Returns the activity state. The object must be JSON compatible.
     */
    static run(activityState) { throw new NotImplementedError('Static-interface implementation of IActivity#run.'); }
}

module.exports = IActivity;