
const NotImplementedError = require('./error/NotImplementedError');

/**
 * @extends {Function}
 * Function within an Instruction.
 * 
 * @description
 * An instruction function expects a certain signature
 *      (ths, scope, cache, call, err, ...args)
 * 
 * An instruction function can return values by assigning property 'out' to the scope
 *  AND return a truthy value. Like so you can actually return undefined values and
 *  tell that the instruction set should end now
 *      {... scope.out = 1234; return true; ...}
 * 
 * An instruction function can throw an error at any time
 *      {... throw new Error("Some error"); ...}
 * 
 * When an instruction function receives an error it should either
 *      Not fix it and return falsy
 *      -> The scheduler will then drop the instruction from the stack and pass it to the
 *          next instruction on te stack which can then do the same until the stack
 *          becomes empty which means that the scheduler will assume the activity is done for
 *          and tells the kernel to free the ressources.
 *      { if (err) return; ...}
 *  or  Fix the error and mark it as 'handled'
 *      { if (err) { "Do smth about it"; err.handled = true; } ...}
 *  or  Do smth against it but have it being passed further down.
 *      { if (err) { "Do smth about it but not marking it handled"; } ...}
 * 
 * Only the first instruction function will receive arguments from the caller.
 * all instruction functions later will at max receive one argument which would be
 *  the return value from another (called) instruction;
 * 
 * @example 
 * const instrFn = new IInstructionFunction((ths, scope, cache, call, err, ...args) => { 
 *      if (err) return;
 *      if (args.length === 0) ; // No return value or arguments were received
 *      const returnValue = args[0]; // Might be undefined but you might not know for sure if it was empty or actually undefined
 *      call(ths, ths.someOtherInstr, "arg1", 4, ["whatever"], { also: "this is ok"});
 *      scope.out = 1234;
 *      throw new Error("Error before returning properly");
 *      return true;
 * });
 */
class IInstructionFunction extends Function {
    /**
     * @param {Object} ths - The this arguments which will be passed to the instruction function.
     *      Use it instead of 'this'.
     * @param {Object} scope - The scope of the function. This object will be persistet so you should think twice
     *      about which data you want to store here.
     * @param {Object} cache - This is the cache which only exists during a single tick. aka is not persisted.
     *      Here you can store alive ingame objects etc.
     * @param {Function} call - A function to be used to call other instructions.
     *      Its signature is (ths, instructionName, ...args).
     * @param {Error | undefined} err - You might want to check if an error occured in a subsequently called instruction.
     * @param  {...any} args - Any arguments passed to the instruction.
     *      Note that only the first instruction function receives arguments so you want to persist these in the scope right away.
     *      Following instruction functions might also receive a single argument being the return value
     *      if they have called other instructions.
     */
    exec(ths, scope, cache, call, err, ...args) {
        throw new NotImplementedError(Error('Interface IInstructionFunction#exec must be implemented.'));
    }
}

module.exports = IInstructionFunction;

/*
 * Activity := InstructionSet<Instruction<InstructionFunction>> 
 */