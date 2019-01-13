
const IInstructionFunction = require('./activity.instruction.IInstructionFunction');

/**
 * An instruction is an ordered list of instruction functions.
 * 
 * @interface
 * @augments Array<IInstructionFunction>
 * 
 * @example
 *  const instruction = new IInstruction(
 *      // First instruction function (index:=0) receives the arguments of the caller.
 *      new IInstructionFunction((ths, scope, cache, call, err, ...args) => {
 *          scope.arg0 = args[0];
 *          scope.arg1 = args[1];
 *          call(SomeActivity.anotherInstruction, "any", "arg", {}, 8);
 *      }),
 *      // Later instruction function may receive return results from a previously called instruction.
 *      // Note that invocations of other instructions through 'call' will always require a split of an instruction
 *      // function into two.
 *      new IInstructionFunction((ths, scope, cache, call, err, ...args) => {
 *          if (err) return err;
 *           
 *          scope.returnValue = args[0];
 *
 *          scope.out = 1234;
 *          return true;
 *      });
 *  );
 */
class IInstruction extends Array {
    
    constructor(...instructionFunctions) { }
    
    /**
     * @param {IActivityEntity} ths - The activity entity.
     * @param {Object} cache - An empty object to use as instruction function cache.
     *      This cache should be initialized. Returned values are ignored.
     * @param {Object} scope - Persisted Instruction scope
     * @param {int} nextFnIndex - The instruction function which will be executed.
     *      Can be used to prevent unnecessary initialization when instruction is resumed and some
     *      Data isnt be needed.
     */
    initCache(ths, cache, scope, nextFnIndex) {

    }
}

module.exports = IInstruction;
