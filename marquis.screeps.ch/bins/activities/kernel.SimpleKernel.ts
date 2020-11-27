import IScheduler from './kernel.scheduler.IScheduler'
import memory from './util/memory'
import shortid from 'shortid'

/**
 * @name SimpleKernel
 * @implements {IKernel}
 */
class SimpleKernel implements IKernel
{
    private memory: object;
    private scheduler: IScheduler;

    constructor(scheduler: IScheduler)
    {
        this.memory = memory('%.kernel');
        this.scheduler = scheduler;
    }

    /**
     * 
     * @param {IActivity} activityClass 
     * @param {IActivityEntity} activityInstance
     * @returns {Function} An activity aware call function.
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

            Object.defineProperties(activityInstance.scope, {
                '_ID': {
                    value: activityInstance.id
                }
            });

            // TODO: Pass the last 'out' value on execState with 'args'

            // If err property has value -> remove the execution state
            if (execState.err && !execState.err.handled)
                activityInstance.execStack.unshift();

            if (execState.index === activityClass[execState.instr].length)
                // Restart the run instruction if it ended
                activityInstance.execStack.unshift();
            
            try
            {   
                // Call the 'instruction-function' at 'index' in 'instruction'
                const execOk = activityClass[execState.instr][execState.index]
                    .call(ths, 
                        ths,
                        activityScope,
                        execState.scope,
                        callFn,
                        execState.err,
                        ...execState.args);

                execState.index++;
                // TODO: What if execOk false?
            }
            catch (error)
            {
                execState.err = error;
            }

            // When the run method return truthy -> repeat
            if (activityInstance.execStack.length === 0 && execOk)
                callFn('run');
        };

        return callFn;
    }

    spawn(activityType, initialScope, prio)
    {
        const id = shortid.generate();
        const activityInstance = {
            class_: activityType,
            id: id,
            mem: memory(`act${id}`),
            scope: initialScope ? initialScope : {},
            stats: {
                spawnTick: Game.time,
                ticks: 0,
                cpu: 0,
                lastTick: Game.time,
                prio: prio
            },
            execStack: []
        };

        this.scheduler.register(activityInstance);

        return activityInstance;
    }

    tick()
    {
        this.scheduler.init(Game.cpu.limit, this.callFactory);
    }
}

export default SimpleKernel