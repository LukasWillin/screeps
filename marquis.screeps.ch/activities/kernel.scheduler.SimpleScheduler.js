

const IActivity = require('./activity.IActivity');
const IScheduler = require('./kernel.scheduler.IScheduler');

/**
 * @implements {IScheduler}
 * @memberof module:kernel/scheduler
 */
class SimpleScheduler {

	static run(schedulingCycle) {
        if (Game.time % this.memory.schedulingCycle === 0) {
            this._schedule();
        }
        if (arguments.length > 0 && _.isInteger(schedulingCycle)) {
            this.memory.schedulingCycle = schedulingCycle;
        }
        this._execute(this._calcCurrentCpuLimit());
	}

	static register(activity, priority) {
        if (!_.isObject(activity) && !(activity instanceof IActivity)) {
            throw new IllegalArgumentError('Given object must be instance of IActivity to be registered.');
        }
        this._activityList.splice(activity);

	}

    static calcCurrentCpuLimit() {
        // Calculate a cpu limit based on the current state.
        return 8;
    }

	static _schedule() {
        _.sortBy(this._activityList, function(activity) {
            return Math.log2(Game.time - activity.creationTimestamp)
                + Math.sqrt(activity.progressPercent)
                + Math.log2(Game.time - this._activityPerformanceIndicators[activity.ID].lastRunTick)
                + activity.staticPriority
                + (10 - (this._activityPerformanceIndicators[activity.ID].cpu));
        });
	}

	static _execute(cpuLimit) {

        for (let i = 0; i < this._activityList.length; i++) {
            const cpuTotal = Game.cpu.getUsed();
            const activity = this._activityList[i];
            const currActivityPerfIndicator = this._activityPerformanceIndicators[activity.ID]
            if (cpuUsed + currActivityPerfIndicator.cpu < cpuLimit) {
                const host = ObjectSystem.getObjectById(activity.hostId);
                const cpuUsed = Game.cpu.getUsed() - cpuTotal;
            }
        }
	}

	static get _activityList() {
        if(_.isUndefinedOrNull(this.memory.activityList))
			this.memory.activityList = [];
		return this.memory.activityList;
	}

    static get _activityPerformanceIndicators() {

    }

    static addActivityClass(activityClass) {
        if (!_.isObject(activityClass)) {
            throw new IllegalArgumentError('An activity class must be an object.');
        }
        if (!_.isString(activityClass.className)) {
            throw new IllegalArgumentError('An activity class must specify a class name.');
        }
        if (_.isObject(this._activityList[activityClass.className])) {
            throw new InternalStateError(`An activity class with class name ${activityClass.className} was already added and cannot be overridden.`);
        }
        this._activityClasses[activityClass.className] = activityClass;
    }
};
Scheduler.className = 'ActivityScheduler';
Scheduler.memory = MemoryUtil.get(ActivityScheduler.className);

module.exports = SimpleScheduler;
