
/**
 * Function within an Instruction.
 * 
 * An instruction function expects a certain signature
 *      (ths, activityScope, instructionScope, call, err, ...args)
 * 
 * An instruction function can return values by assigning property 'out' to the scope
 *  AND return a truthy value if the return value is falsy out is ignored;
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
 * 
 * Only the first instruction function will receive arguments from the caller.
 * all instruction functions later will at max receive one argument which would be
 *  the return value from another (called) instruction;
 * 
 * @interface
 * 
 * @param {Activity} ths - Activity as ths reference (this).
 * @param {Object} scope - The activity scope.
 * @param {Object} instrScope - The instruction scope.
 * @param {*} call 
 * @param {*} err 
 * @param  {...any} args 
 * 
 * @example
 * function instr0 (scope, instrScope, call, err, ...args) { 
 *      if (err) return;
 *      if (args.length === 0) ; // No return value or arguments were received
 *      const returnValue = args[0]; // A return value is always @index 0. If undefined it means no return value. 
 *              // So make sure you set anything but undefined for scope.out
 *      call("someOtherInstr", "arg1", 4, ["whatever"], { also: "this is ok"});
 *      scope.out = 1234;
 *      throw new Error("Error before returning properly");
 *      return true;
 * }
 *  // Can also use lambda
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
 */
interface IInstructionFunction extends Function
{
    (ths: Object, scope: Object, instrScope: Object, call: Function, err: Error, ...args: any): Boolean;
}

export default IInstructionFunction;