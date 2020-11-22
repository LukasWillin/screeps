/* eslint-disable no-unused-vars */

import IInstructionFunction from './activity.instruction.IInstructionFunction';

/**
 * Array of IInstructionFunctions.
 * 
 * [function(...) {}, function(...){}, etc...]
 * 
 * @name IInstruction
 * @interface
 * 
 * @example
 *  // Single use instruction
 *  const instruction = [
 *      // First instruction function (index:=0) receives the arguments of the caller.
 *      (mem, scope, cache, call, err, ...args) =>
 *      {
 *          scope.arg0 = args[0];
 *          scope.arg1 = args[1];
 *          call(SomeActivity.anotherInstruction, "any", "arg", {}, 8);
 *      },
 *      (mem, scope, cache, call, err, ...args) =>
 *      {
 *          if (err) return err;
 *           
 *          scope.returnValue = args[0];
 *
 *          scope.out = 1234; // Some calculated result
 *          return true; // Return true to signal scope.out is the return value.
 *      }
 *  ];
 */
interface IInstruction extends Array<IInstructionFunction>
{
    
};

export default IInstruction;