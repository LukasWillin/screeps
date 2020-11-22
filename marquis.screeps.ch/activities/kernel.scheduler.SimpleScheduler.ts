
import IScheduler from './kernel.scheduler.IScheduler'

import IllegalArgumentError from './error/IllegalArgumentError'
import isUndefinedOrNull from './util/fun/isUndefinedOrNull'
import memory from './util/memory'
import _isObject from 'lodash/isObject'
import _sortBy from 'lodash/sortBy'
import _isNumber from 'lodash/isNumber'
import { Dictionary } from 'lodash'
import IActivity from './activity.IActivity'

/**
 * @implements {IScheduler}
 */
class SimpleScheduler implements IScheduler
{
    _activityClassHashMap: Dictionary<IActivity>;
    _mem : any;

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

    register(activityInstance)
    {
        if (!_isObject(activityInstance) && !activityInstance.class_ )
            throw new IllegalArgumentError(Error('Given activity was not an Object or did not specify the name of an Activity class.'));
        
        this._activityList.unshift(activityInstance);
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
            const cpuSpent = Game.cpu.getUsed();
            // Only run the activity if chances of overspending the cpu budget are low
            if (cpuSpent + (activity.stats.cpu / activity.stats.ticks) < cpuBudget) 
            {
                // Get instruction set and execute it
                const iActivityClass = this.activityClassHashMap[activity.class];

                const callFn = callFactory(iActivityClass, activity)();

                // call next until budget was reached for activity instance.
                callFn.next();

                // Update stats
                activity.stats.cpu += Game.cpu.getUsed() - cpuSpent;
                activity.stats.ticks++;
                activity.stats.lastTick = tick;
            }
        }
    }

    get _activityList() 
    {
        return this._mem.activityList ? this._mem.activityList : [];
    }

    /**
     * The activity classes are all the available classes required to execute an activity.
     * The activity json object specifies the name of the class which will execute it.
     * @param {Object} activityClasses - An object containing classes by class name.
     * 
     * @example
     *  {
     *      'name': class BuilderActivity { }
     *  }
     */
    set activityClassHashMap(activityClassHashMap) 
    {
        this._activityClassHashMap = activityClassHashMap;
    }

    get activityClassHashMap()
    {
        return this._activityClassHashMap ? this._activityClassHashMap : {};
    }
}

export default SimpleScheduler