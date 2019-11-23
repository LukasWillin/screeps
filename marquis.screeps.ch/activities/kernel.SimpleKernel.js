
/**
 * @name SimpleKernel
 * @implements {IKernel}
 */
class SimpleKernel
{
    constructor()
    {

    }

    /**
     * 
     * @param {IActivity} activityClass 
     * @param {IActivityEntity} activityInstance
     */
    callFactory(activityClass, activityInstance)
    {
        const ths = {};
        const activityScope = activityInstance.scope;

        /**
         * Calls the instruction requested by the caller.
         * It creates a new executionState / scope for that instruction and 
         * executed it automatically with 'next'.
         * @param {string} instruction - Name of the instruction.
         * @param  {...any} args 
         */
        function callFn(instruction, ...args)
        {
            const execState = {
                instr: instruction,
                index: 0,
                scope: {},
                args: args,
                out: null,
                err: null
            };
            activityInstance.execStack.shift(execState);
            // Should be done by scheduler: callFn.next();
            // This function only prepares for execution
        }

        callFn.init = function () 
        {
            // TODO: What does it initialize? _> ths with necessary runtime instances like buildings and creeps.
            activityClass.init(ths, activityInstance.scope);
        };

        callFn.next = function ()
        {
            const execState = activityInstance.execStack[0];
            // TODO: Pass the last 'out' value on execState with 'args'

            // If err property has value -> remove the execution state
            if (execState.err)
                activityInstance.execState.unshift();
            
            try
            {   
                // Call the 'instruction-function' at 'index' in 'instruction'
                execState.out = activityClass[execState.instr][execState.index]
                    .call(ths, 
                        ths,
                        activityScope,
                        execState.scope,
                        callFn,
                        execState.err,
                        ...execState.args);
            }
            catch (error)
            {
                execState.err = error;
            }
        };
    }
}

module.exports = SimpleKernel;