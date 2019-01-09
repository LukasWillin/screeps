
const _ = require('lodash');
const IInstructionFunction = require('./activity.instruction.InstructionFunction');

/**
 * @implements {IInstruction}
 */
class Instruction extends Array {
    /**
     * @param  {...IInstructionFunction} instructionFunctions - One or many ordered instruction functions.
     */
    constructor(...instructionFunctions) {
        for(let i = 0, instr = instructionFunctions[i]; i < instructionFunctions.length; instr = instructionFunctions[++i]) {
            this.push(instr);
        }
    }
}

module.exports = Instruction;