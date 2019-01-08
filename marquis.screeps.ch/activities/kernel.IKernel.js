
// kernel -> scheduler.schedule
// kernel -> scheduler.getNext
// kernel -> scheduler.run(activity) // Full activity

const IScheduler = require('./activity.IScheduler');

/**
 * The activator is the kernel logik.
 * The root for all executions.
 */
class IKernel {
    /**
     * Constructs an activator instance.
     * @param {IScheduler} scheduler - The scheduler to use.
     */
    constructor(scheduler) { }

    run() {
        throw new NotImplementedError("Interface implementation of IKernel#run");
    }

    /**
     * This function is passed to the current activity instruction function.
     * @param {Object} thisArg - Any object serving as this.
     * @param {IInstruction} instruction - Any instruction.
     * @param  {...any} args (optional) - Caller arguments. 
     */
    call(thisArg, instruction, ...args) {
        throw new NotImplementedError("Interface implementation of IKernel#call");
    }
}