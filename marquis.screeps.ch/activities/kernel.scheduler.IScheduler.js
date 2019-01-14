

const NotImplementedError = require('/errors/NotImplementedError');
const IInstruction = require('./activity.instruction.IInstruction');
const IActivityExecutionState = require('./kernel.IActivityExecutionState');

/**
 * @interface
 * @memberof module:kernel/scheduler
 */
class IScheduler {
    constructor(activityList) { }

    getNext() {
        throw new NotImplementedError("Interface implementation of IScheduler#schedule");
    }

    /**
     * Activity events reported by the kernel.
     * @param {string} event 
     * @param {IActivityEntity} activity 
     */
    onActivityEvent(event, activity) {
        throw new NotImplementedError("Interface implementation of IScheduler#onActivityEvent");
    }
}

module.exports = IScheduler;