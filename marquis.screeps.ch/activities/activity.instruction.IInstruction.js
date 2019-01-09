

/**
 * An instruction is an ordered list of instruction functions.
 * @type {Array<InstructionFunction>}
 */
class IInstruction extends Array {
    constructor(...instructionFunctions) { }   
}

module.exports = IInstruction;

/*
    @example

    const Instruction = new Instruction(
        new IInstructionFunction((ths, scope, cache, call, err, ...args) => {
            scope.arg0 = args[0];
            scope.arg1 = args[1];

            call(SomeActivity.anotherInstruction, "any", "arg", {}, 8);
        }),
        new IInstructionFunction((ths, scope, cache, call, err, ...args) => {
            if (err) return err;
            
            scope.returnValue = args[0];

            scope.out = 1234;
            return true;
        })
    );
*/