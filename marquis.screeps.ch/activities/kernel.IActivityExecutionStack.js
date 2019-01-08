
const IInstructionExecutionState = require('./kernel.IActivityExecutionState');

/**
 * An array serving as a stack for the execution state of an activity.
 * @type {Array<IInstructionExecutionState>}
 */
class IActivityExecutionStack extends Array {

}

module.exports = IActivityExecutionStack;