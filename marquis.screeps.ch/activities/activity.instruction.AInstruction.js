
const _ = require('lodash');
const AInstructionFunction = require('./activity.instruction.AInstructionFunction');
const IInstruction = require('./activity.instruction.IInstruction');

const setProto = Object.setPrototypeOf;
const getProto = Object.getPrototypeOf;

/**
 * Abstract implementation of IInstruction
 * 
 * @abstract
 * @implements {IInstruction}
 * 
 * @example
 *  // Single use instruction
 *  const instruction = new AInstruction(
 *      // First instruction function (index:=0) receives the arguments of the caller.
 *      new AInstructionFunction((mem, scope, cache, call, err, ...args) => {
 *          scope.arg0 = args[0];
 *          scope.arg1 = args[1];
 *          call(SomeActivity.anotherInstruction, "any", "arg", {}, 8);
 *      }),
 *      new AInstructionFunction((mem, scope, cache, call, err, ...args) => {
 *          if (err) return err;
 *           
 *          scope.returnValue = args[0];
 *
 *          scope.out = 1234;
 *          return true;
 *      });
 *  );
 *  // Multi use implementation
 *  class ConcreteInstruction extends AInstruction { }
 *  Object.defineProperties(ConcreteInstruction.prototype, {
 *      "0": { 
 *          value: new AInstructionFunction((mem, scope, cache, call, err, ...args) => {
 *              scope.arg0 = args[0];
 *              scope.arg1 = args[1];
 *              scope.out = "Calculated Result";
 *              return true;
 *          })
 *      }
 *  });
 *  const multiConcreteInstruction = new ConcreteInstruction();
 */
class AInstruction extends Array {
    /**
     * @param  {...IInstructionFunction} instructionFunctions - One or many ordered instruction functions.
     */
    constructor(...instructionFunctions) {
        for(let i = 0, instr = instructionFunctions[i]; i < instructionFunctions.length; instr = instructionFunctions[++i]) {
            this.push(instr);
        }
    }
}

module.exports = AInstruction;