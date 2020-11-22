

/**
 * The instruction function execution state keeps track of the progress of an instruction.
 * An instruction ends when it returns truthy or it reached the end. The output value
 * must be assigned to the out variable within the scope.
 * @interface
 * @memberof module:activity/instruction
 * 
 * @property {string} activityType - The name / type of the instruction implementing the instruction.
 * @property {string} instructionName - Name of the instruction.
 * @property {int} nextFn - Next instruction within the instruction (list).
 * @property {Array<any>} args - The arguments to be passed to the next instruction function.
 * @property {Object} scope - scope of the instruction set.
 * @property {any} scope.out - The value returned should be assigned to this property.
 *      Everything will be accepted as an output variable. Even 'undefined'.
 * @property {Error} err - The last error which occured.
 *      If the error is not assigned a value 'handled = true' the error will be passed to the
 *      the instruction will be ended if the error is not marked as handled. And then passed
 *      to the previous instruction and so forth.
 */
class IInstructionExecutionState { }

module.exports = IInstructionExecutionState;