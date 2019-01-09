

const NotImplementedError = require('./error/NotImplementedError');
const IInstruction = require('./activity.instruction.IInstruction');
const IInstructionFunction = require('./activity.instruction.IInstructionFunction');
const IInstructionSet = require('./activity.instruction.IInstructionSet');

/**
 * An activity implements the logic to execute specific task(s).
 * 
 * The activity class never creates instances but implements the static instructions
 * to execute upon an activity entity.
 * 
 * @public @class
 * @implements {IInstructionSet}
 * @property {IInstruction} run - An activity must at least implement one instruction to be run by the scheduler
 *      with the property name 'run'.
 */
class IActivity {
    
}

Object.defineProperties(IActivity, {
    
    /** Root instruction at which the execution starts or resumes from.
     * @static @public 
     * @type {IInstruction}
     */
    static run: { 
        value: new IInstruction(
            new IInstructionFunction((ths, scope, cache, call, err, ...args) => { 
                throw new NotImplementedError("Interface IActivity#run must be overridden.");
            })
        )
    },

    /** Initializes given cache object with required data to run a certain instruction.
     * The init cache is ran once before the first call to any instruction.
     * @static @public
     * @function
     * @param {IActivityEntity} activityEntity - The persisted activity entity from memory.
     * @param {IInstruction} nextInstruction - The instruction which will be called next. 
     * @param {Object} cache - An empty object to initialize.
     *      This object is a shortcut to 'activityInstance.cache'.
     */
    static initCache(activityEntity, nextInstruction, cache) {
        throw new NotImplementedError("Interface IActivity#initCache must be overridden.");
    }
});

module.exports = IActivity;