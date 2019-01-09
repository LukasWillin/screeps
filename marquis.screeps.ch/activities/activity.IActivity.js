

const NotImplementedError = require('./error/NotImplementedError');
const Instruction = require('./activity.instruction.Instruction');
const InstructionFunction = require('./activity.instruction.InstructionFunction');
const IInstructionSet = require('./activity.instruction.IInstructionSet');

/**
 * An activity implements the logic to execute specific task(s).
 * An activity must at least implement one instruction to be run by the scheduler
 * with the name 'run'.
 * The activity class never creates instances but implements the static instructions
 * to execute upon an activity state.
 * @implements {IInstructionSet}
 */
class IActivity {
    
}

Object.defineProperties(IActivity, {
    /**
     * Root function at which the execution starts or resumes from.
     */
    run: { 
        value: new Instruction(
            function instr0(ths, scope, cache, call, err, ...args) { 
                throw new NotImplementedError("Interface implementation of IActivity#run");
            }
        )
    },
    initCache(cache) {

    }
});

module.exports = IActivity;