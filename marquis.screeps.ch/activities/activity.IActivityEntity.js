
/**
 * 
 * The activity entity contains all info about an active activity.
 * Note that the only information which should be accessible to instruction functions
 * is the memory (mem) property.
 * @interface
 * @memberof module:activity
 *
 * @property {string} type - Registered type (class) of the activity.
 * @property {Object} mem - The memory of the activity. Which is also served as the memory (mem)
 *      argument for instruction functions.
 * @property {Object} mem.cache - A cache object which is made available on the memory object.
 *      This object must be removed before it is stored in memory or be marked as not 'enumerable'.
 * @property {Object} stats - Statistics about its resource usage.
 *      Here the kernel stores and tracks the ressource usage of this activity 
 * @property {Array<IInstructionExecutionState>} execStack - The execution stack in order to be able to resume it later.
 */
class IActivityEntity { }

module.exports = IActivityEntity;