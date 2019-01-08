

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
        function instrFn0(ths, scope, call, err, ...args) {
            scope.anArg = args[0];
        },
        function instrFn1(ths, scope, call, err, ...args) {
            if (err) return err;

            scope.out = 1234;
            return true;
        }
    );
*/