/* eslint-disable no-unused-vars */

/**
 * The full activity entity which should only be accessed by the kernel and scheduler.
 * 
 * @name IActivityEntity
 * 
 * @interface
 * 
 * @property {string} class_ - Class name of the iActivity.
 * @property {int} id - Id of the activity. (Must also be present in scope)
 * 
 * @property {Object} scope - The memory and scope of the activity entity.
 * @property {int} scope._ID - Non numerable property. Same as id
 * 
 * @property {Object} stats - The resource usage statistics for this activity entity.
 * @property {int} stats.spawnTick - The tick / Game.time when then activity entity was spawned.
 * @property {int} stats.ticks - Tick count or how many ticks the activty ran.
 * @property {float} stats.cpu - The cpu time the activity used in total.
 * @property {int} stats.lastTick - The last tick / Game.time when the activity was executed.
 * 
 * @property {float} prio - A definable priority which can be manipulated from outside
 *      via the kernel.
 * 
 * @property {IActivityExecutionStack} execStack - The execution stack in order to be able to resume it later.
 *      The last call is at index 0. Use shift and unshift to add and remove calls.
 */
const IActivityEntity = {};

/**
 * @implements {IActivityEntity}
 */
class ActivityEntity
{
    constructor(class_, scope, prio, stats, callStack) 
    { 

    }
}

module.exports = ActivityEntity;

// Rules for the activity entity:
// 1. All the activity entity sees is its memory.
// 2. the memory can make calls through passed in utility function call controlled by the scheduler