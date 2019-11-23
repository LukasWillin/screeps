/* eslint-disable no-unused-vars */

const NotImplementedError = require('/errors/NotImplementedError');
const IInstruction = require('./activity.instruction.IInstruction');
const IActivityExecutionState = require('./kernel.IActivityExecutionState');

/**
 * @name {IScheduler}
 * @interface
 */
const ISchedule = {};

// --- How to create instructions (parted functions)

/**
 * Instruction
 * @type {Array<InstructionFunction>}
 * 
 */
const Instruction = [
    function instrFn0(scope, call, err, ...args)
    {
        scope.anArg = args[0];
    },
    function instrFn1(scope, call, err, ...args)
    {
        if(err) return err;

        scope.out = 1234;
        return true;
    }
];

/**
 * A function which takes a this-argument and a scope to operate
 * and returns only with a value when it has calculated one otherwise 
 * all data must be stored within the scope.
 * The scope is store in memory so dont overuse it! Only store the most relevant data in it.
 * 
 * @example 
 * // Instruction function (with args)
 * [
 *  function (ths, scope, call, err, ...args) {
 *      scope.id = 1234;
 *      call(ths, ths.someOtherInstructionSet, args); // Call another instruction set whos result is passed as an argument to instruction #1 if set true.
 *  },
 *  function endInstrFn(ths, scope, call, err, ...args) {
 *      return args[0];
 *  }
 * ]
 */
class InstructionFunction extends Function { }