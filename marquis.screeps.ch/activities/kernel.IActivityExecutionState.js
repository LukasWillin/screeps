/* eslint-disable no-unused-vars */

/**
 * An instruction ends when it returns truthy or it reached the end. The output value
 * must be assigned to the out variable within the scope.
 * @name IActivityExecutionState
 * @property {string} instr - Key of the iActivity-instruction.
 * @property {int} index - Next / Current instruction index. (Will be called first)
 * @property {Oject} scope - The instruction scope.
 * @property {Array<any>} args - The arguments to be passed to the next instruction function at `index + 1`.
 * @property {any} out - The value returned should be assigned to this property.
 *      Everything will be accepted as an output variable. Even 'undefined' as long out is own-property of scope.
 *      Will be passed as args to the function using the return value.
 * @property {Error} err - The last error which occured.
 *      If the error is not assigned a value 'handled = true' the error will be passed to the
 *      the instruction will be ended if the error is not marked as handled. And then passed
 *      to the previous instruction and so forth.
 * @example
 * // First instruction 1 calls instruction 2 which at some point returns a value via `out`.
 * // The value 2 will be passed as argument to the next instruction in instruction 1.
 * Instr1#0 -> Instr2#0:out=2 -> Instr1#1
 */

// TODO: Wie werden Instruktionen ausgeführt, die nicht zur selben Activity gehören? Ist das überhaupt möglich?
// --> Für eine erste Version nicht. Utility funktionen werden halt als Teil einer Activity Instruktion ausgeführt
// Ist wohl auch fairer.