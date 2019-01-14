/**
 * 
 * The activity entity contains all info about an active activity.
 * Note that the only information which should be accessible to instruction functions
 * is the memory (mem) property.
 * @interface
 *
 * @property {string} type - Registered type (class) of the activity.
 * @property {Object} mem - The memory of the activity. Which is also served as the this (mem)
 *      argument for instruction functions.
 * @property {Object} stats - Statistics about its resource usage.
 * @property {Array<IInstructionExecutionState>} execStack - The execution stack in order to be able to resume it later.
 *
 */
class IActivityEntity { }

module.exports = IActivityEntity;