/**
 * An instruction ends when it returns truthy or it reached the end. The output value
 * must be assigned to the out variable within the scope.
 * @property {string} instructionName - An ordered instructions list.
 * @property {int} nextFn - Next instruction within the instruction (list).
 * @property {Array<any>} args - The arguments to be passed to the next instruction function.
 * @property {Object} scope - scope of the instruction set.
 * @property {any} scope.out - The value returned should be assigned to this property.
 *      Everything will be accepted as an output variable. Even 'undefined'.
 * @property {Error} err - The last error which occured.
 *      If the error is not assigned a value 'handled = true' the error will be passed to the
 *      the instruction will be ended if the error is not marked as handled. And then passed
 *      to the previous instruction and so forth.
 * @example
 * // First set1 calls set2 which at some point returns a value
 * // The value unless its undefined will be passed as argument
 * // to the next instruction in set1 (which is #1)
 * InstrSet1#0 -> InstrSet2:returns 2 -> InstrSet1#1
 */
class IInstructionExecutionState {
    constructor(instructionName, nextFn, args, scope, err) {}
}

module.exports = IInstructionExecutionState;