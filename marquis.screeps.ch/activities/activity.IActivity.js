/* eslint-disable no-unused-vars */
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
 * @member {Instruction} run - The initial run instruction.
 * @member {Function} init - An init function which prepares a 'this' variable with 
 *      required runtime variables like creeps and building etc.
 * 
 * @example
 * // An Activity could be the following. (IInstructionFunction arguments have been ommitted.)
 *  const BuilderActivity = {
 *      init: function(activityInstance, ths) {},
 *      run: [function() {}],
 *      build: [function() {},function() {}],
 *      collect: [function() {}]
 *  }
 */
const IActivity = {};