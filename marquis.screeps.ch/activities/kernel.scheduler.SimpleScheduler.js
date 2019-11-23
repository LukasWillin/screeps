
const IllegalArgumentError = require('./errors.IllegalArgumentError');
const isUndefinedOrNull = require('./util/fun/isUndefinedOrNull');
const memory = require('./util/memory');
const _isObject = require('lodash/isObject');
const _sortBy = require('lodash/sortBy');
const _isNumber = require('lodash/isNumber');

/**
 * @implements {IScheduler}
 */
class Scheduler
{
    /**
     * Called by kernel.
     * @param {float} cpuBudget - A cpu budget.
     * @param {Function} callFactory - Factory creating an activity aware call function.
     */
    init(cpuBudget, callFactory) 
    {
        this._mem = memory('%%%.schd');
        
        if (isUndefinedOrNull(this._mem.activityList))
            this._mem.activityList = [];

        Object.defineProperties(this, {
            '_activityClassList': { value: [], writable: true }
        });
        
        this._tick(cpuBudget, callFactory);
    }

    register(activity)
    {
        if (!_isObject(activity) && !activity.name ) 
            throw new IllegalArgumentError(Error('Given activity was not an Object and did not specify the name of an Activity class.'));
        
        this._activities.unshift(activity);
    }

    _schedule() 
    {
        // Iterate over IActivityEntity-List
        _sortBy(this._activityList, function (a) 
        {
            // Higher number means higher (temporary) prio for next run
            return ((a.stats.ticks / a.stats.cpuTime) // Calculate how much cpu the activity need per run (overall)
                + (Game.time - a.stats.lastRun) * 1.5) // How many ticks back was the last run? * 1.5 bias
                * (_isNumber(a.prio) ? a.prio : 1); // A user definable priority bias as multiplier default = 1.0
        });
    }

    /**
     * 
     * @param {int} cpuBudget 
     * @param {Function} callFactory - Creates an activity aware call function.
     */
    _tick(cpuBudget, callFactory)
    {
        cpuBudget += 0.5;
        cpuBudget = cpuBudget > 2 ? cpuBudget : 2; // At least a budget of 2

        // Schedule before execution.
        this._schedule();

        const tick = Game.time;

        for (let i = 0; i < this._activityList.length; i++) 
        {
            const activity = this._activityList[i];
            const cpuSpend = Game.cpu.getUsed();
            // Only run the activity if chances of overspending the cpu budget are low
            if (cpuSpend + (activity.stats.cpu / activity.stats.ticks) < cpuBudget) 
            {
                // Get instruction set and execute it
                const iActivityClass = this.activityClassList[activity.class_];

                const callFn = callFactory(iActivityClass, activity)();
                // Inside call factory
                // const currentCall = activity.callStack[0]; // last call at index 0. IactivityExecutionState
                // iActivityClass[currentCall.instr][currentCall.index](activity.scope, currentCall.scope, call, currentCall.err, ...currentCall.args);
                // Call should:
                // - Be able to call subsequent instrucitions
                // make a call bak to previous instruction
                // call another instruction from same activity class

                // Update stats
                activity.stats.cpu += Game.cpu.getUsed() - cpuSpend;
                activity.stats.ticks++;
                activity.stats.lastTick = tick;
            }
        }
    }

    /**
     * List of activity entities.
     */
    get _activityList() 
    {
        return this._mem.activityList;
    }

    /**
     * The activity classes are all the available classes required to execute an activity.
     * The activity json object specifies the name of the class which will execute it.
     * @param {Object} activityClasses - An object containing classes by class name.
     * @example
     *  const activity = {
     *      'name': 'BuilderActivity'
     *  }
     */
    set activityClassList(activityClasses) 
    {
        return this._activityClasses = activityClasses;
    }

    get activityClassList()
    {
        return this._activityClassList ? this._activityClassList : [];
    }
}
Scheduler.class = 'Scheduler';

module.exports = Scheduler;
