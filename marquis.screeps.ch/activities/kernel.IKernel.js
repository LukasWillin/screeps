/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

// kernel -> scheduler.schedule
// kernel -> scheduler.getNext
// kernel -> scheduler.run(activity) // Full activity

const IScheduler = require('./activity.IScheduler');

/**
 * The kernel is the kernel logik.
 * The root for all executions.
 * @name IKernel
 * @interface
 */
class IKernel
{
    /**
     * Constructs a kernel instance.
     * @param {IScheduler} scheduler - The scheduler to use.
     */
    constructor(scheduler) { }

    /**
     * Entry point at the beginning of the tick.
     */
    tick() {}

    /**
     * 
     * @param {IActivity} iActivity - An activity implementation.
     * @param {Object} [initialScope] - An initial scope that will be used if is object.
     *      The scope is serialized and is the state of the activity entity instanceof 'activityClass'.
     *      The scope is extended with a property `_ID`. 
     *      This method returns the resulting activity scope which is reference equal to initialScope.
     */
    spawn(iActivity, initialScope) { }

    /**
     * Set or get a priority for the activity with id.
     * @param {*} activityId - Activity for which to get or set the priority.
     * @param {float} [prio] - Ommit to get only.
     */
    prio(activityId, prio) { }

    /**
     * This function is passed to the current activity instruction function.
     * @param {Object} scope - Scope of the activity. Also applied to function as this.
     * @param {IInstruction} instruction - Any instruction.
     * @param {...any} args (optional) - Caller arguments. 
     */
    callFactory(scope, instruction, ...args) {}
}