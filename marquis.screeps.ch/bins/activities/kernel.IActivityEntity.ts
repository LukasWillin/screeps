/* eslint-disable no-unused-vars */

/**
 * The full activity entity which should only be accessed by the kernel and scheduler.
 * Rules for the activity entity:
 * 1. All the activity entity sees is its memory.
 * 2. the memory can make calls through passed in utility function call controlled by the scheduler
 * 
 * @name IActivityEntity
 * 
 * @interface
 */
interface IActivityEntity
{
    /**
     * Class name of the iActivity. Used to pass it to the according functions.
     */
    class_: string;
    
    /**
     * Id of the activity. (Must also be present in scope)
     * 
     * type shortid
     */
    id: string;
    
    /**
     * The memory and scope of the activity entity.
     * 
     * Non enumerable property.
     * scope._ID: shortid;
     * 
     * Passed into activity functions. 
     */
    scope: Object;
    
    /**
     * The resource usage statistics for this activity entity.
     * 
     * The tick / Game.time when then activity entity was spawned.
     * @type {int}
     * stats.spawnTick: number;
     * 
     * Tick count or how many ticks the activty ran.
     * @type {int}
     * stats.ticks: number;
     *
     * The cpu time the activity used in total.
     * @type {float}
     * stats.cpu: number;
     * 
     * The last tick / Game.time when the activity was executed.
     * @type {int}
     * stats.lastTick: number;
     */
    stats: Object;
    
    /**
     * A definable priority which can be manipulated from outside
     * via the kernel.
     * @type {float}
     */
    prio: number;
};

export default IActivityEntity;