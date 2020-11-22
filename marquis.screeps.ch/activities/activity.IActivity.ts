/* eslint-disable no-unused-vars */

import IInstruction from "./activity.instruction.IInstruction";

/**
 * An activity implements the logic to execute specific task(s).
 * An activity must at least define one instruction to be run by the scheduler
 * with the key 'run'.
 *
 * Activity := InstructionSet<Instruction<InstructionFunction>> 
 * 
 * @name IActivity
 * @interface
 * 
 * @member {activity.instruction.IInstruction} run - 
 *
 * @example
 *  // An Activity could be the following. (IInstructionFunction arguments have been ommitted.)
 *  const BuilderActivity = {
 *      init: function(activityInstance, ths) {},
 *      run: [function() {}],
 * 
 *      build: [function() {},function() {}],
 *      collect: [function() {}]
 *  };
 */
interface IActivity
{
    /**
     * An init function which prepares a 'this' variable with 
     * required runtime variables like creeps, buildings etc.
     */
    init(): void;

    /**
     * The initial run instruction.
     */
    run: IInstruction;
};

export default IActivity;