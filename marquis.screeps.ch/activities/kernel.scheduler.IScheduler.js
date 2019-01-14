
const NotImplementedError = require('/errors/NotImplementedError');
const IInstruction = require('./activity.instruction.IInstruction');
const IActivityExecutionState = require('./kernel.IActivityExecutionState');

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

// --- How to create instructions (parted functions)

/**
 * A function which takes a this-argument and a scope to operate
 * and returns only with a value when it has calculated one otherwise 
 * all data must be stored within the scope.
 * The scope is store in memory so dont overuse it! Only store the most relevant data in it.
 * 
 * @example 
 * // Instruction function (with args)
 * [
 *  function (mem, scope, call, err, ...args) {
 *      scope.id = 1234;
 *      call(mem, mem.someOtherInstructionSet, args); // Call another instruction set whos result is passed as an argument to instruction #1 if set true.
 *  },
 *  function endInstrFn(mem, scope, call, err, ...args) {
 *      return args[0];
 *  }
 * ]
 */
class InstructionFunction extends Function { }

/**
 * An instruction ends when it returns truthy or it reached the end. The output value
 * must be assigned to the out variable within the scope.
 * @property {Array<Function>} fns - An ordered instructions list.
 * @property {int} nextFn - Next instruction within the instruction set.
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
const InstructionState = { };