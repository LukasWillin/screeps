
import IActivity from "./activity.IActivity";
import IInstruction from './activity.instruction.IInstruction';

// kernel -> scheduler.schedule
// kernel -> scheduler.getNext
// kernel -> scheduler.run(activity) // Full activity

/**
 * The kernel is the kernel logik.
 * The root for all executions.
 * @name IKernel
 * @interface
 */
interface IKernel
{
    /**
     * Entry point at the beginning of the tick.
     */
    tick() : void;

    /**
     * 
     * @param {IActivity} iActivity - An activity implementation.
     * @param {Object} [initialScope] - An initial scope that will be used if is object.
     *      The scope is serialized and is the state of the activity entity instanceof 'activityClass'.
     *      The scope is extended with a property `_ID`. 
     *      This method returns the resulting activity scope which is reference equal to initialScope.
     */
    spawn(iActivity: IActivity, initialScope: Object): void;

    /**
     * Set or get a priority for the activity with id.
     * @param {*} activityId - Activity for which to get or set the priority.
     * @param {float} [prio] - Ommit to get only.
     */
    prio(activityId: string, prio: number): void;

    /**
     * This function is passed to the current activity instruction function.
     * @param {Object} scope - Scope of the activity. Also applied to function as this.
     * @param {IInstruction} instruction - Any instruction.
     * @param {...any} args (optional) - Caller arguments. 
     */
    callFactory(scope: Object, instruction: IInstruction, ...args: any): void;
}

export default IKernel