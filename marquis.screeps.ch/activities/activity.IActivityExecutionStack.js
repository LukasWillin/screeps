
const IInstructionExecutionState = require('./activity.instruction.IInstructionExecutionState');

/**
 * An array serving as a stack for the execution state of an activity.
 * @interface
 * @memberof module:activity
 * 
 * @augments Array<IInstructionExecutionState>
 */
class IActivityExecutionStack extends Array {

}

module.exports = IActivityExecutionStack;