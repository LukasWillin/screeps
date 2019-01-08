

const NotImplementedError = require('./errors.NotImplementedError');
const IInstructionSet = require('./activity.instruction.IInstructionSet');

/**
 * An activity implements the logic to execute specific task(s).
 * An activity must at least implement one instruction to be run by the scheduler
 * with the name 'run'.
 * @implements {IInstructionSet}
 */
class IActivity {
    
}

Object.defineProperties(IActivity.prototype, {
    run: { 
        value: [
            function instr0(ths, scope, call, err, ...args) { 
                throw new NotImplementedError("Interface implementation of IActivity#run");
            }
        ] 
    }
});

module.exports = IActivity;