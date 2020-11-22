"use strict";
exports.__esModule = true;
var IllegalArgumentError_1 = require("./error/IllegalArgumentError");
var isUndefinedOrNull_1 = require("./util/fun/isUndefinedOrNull");
var memory_1 = require("./util/memory");
var isObject_1 = require("lodash/isObject");
var sortBy_1 = require("lodash/sortBy");
var isNumber_1 = require("lodash/isNumber");
/**
 * @implements {IScheduler}
 */
var SimpleScheduler = /** @class */ (function () {
    function SimpleScheduler() {
    }
    /**
     * Called by kernel.
     * @param {float} cpuBudget - A cpu budget.
     * @param {Function} callFactory - Factory creating an activity aware call function.
     */
    SimpleScheduler.prototype.init = function (cpuBudget, callFactory) {
        this._mem = memory_1["default"]('%%%.schd');
        if (isUndefinedOrNull_1["default"](this._mem.activityList))
            this._mem.activityList = [];
        Object.defineProperties(this, {
            '_activityClassList': { value: [], writable: true }
        });
        this._tick(cpuBudget, callFactory);
    };
    SimpleScheduler.prototype.register = function (activityInstance) {
        if (!isObject_1["default"](activityInstance) && !activityInstance.class_)
            throw new IllegalArgumentError_1["default"](Error('Given activity was not an Object or did not specify the name of an Activity class.'));
        this._activityList.unshift(activityInstance);
    };
    SimpleScheduler.prototype._schedule = function () {
        // Iterate over IActivityEntity-List
        sortBy_1["default"](this._activityList, function (a) {
            // Higher number means higher (temporary) prio for next run
            return ((a.stats.ticks / a.stats.cpuTime) // Calculate how much cpu the activity need per run (overall)
                + (Game.time - a.stats.lastRun) * 1.5) // How many ticks back was the last run? * 1.5 bias
                * (isNumber_1["default"](a.prio) ? a.prio : 1); // A user definable priority bias as multiplier default = 1.0
        });
    };
    /**
     *
     * @param {int} cpuBudget
     * @param {Function} callFactory - Creates an activity aware call function.
     */
    SimpleScheduler.prototype._tick = function (cpuBudget, callFactory) {
        cpuBudget += 0.5;
        cpuBudget = cpuBudget > 2 ? cpuBudget : 2; // At least a budget of 2
        // Schedule before execution.
        this._schedule();
        var tick = Game.time;
        for (var i = 0; i < this._activityList.length; i++) {
            var activity = this._activityList[i];
            var cpuSpent = Game.cpu.getUsed();
            // Only run the activity if chances of overspending the cpu budget are low
            if (cpuSpent + (activity.stats.cpu / activity.stats.ticks) < cpuBudget) {
                // Get instruction set and execute it
                var iActivityClass = this.activityClassHashMap[activity["class"]];
                var callFn = callFactory(iActivityClass, activity)();
                // call next until budget was reached for activity instance.
                callFn.next();
                // Update stats
                activity.stats.cpu += Game.cpu.getUsed() - cpuSpent;
                activity.stats.ticks++;
                activity.stats.lastTick = tick;
            }
        }
    };
    Object.defineProperty(SimpleScheduler.prototype, "_activityList", {
        get: function () {
            return this._mem.activityList ? this._mem.activityList : [];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SimpleScheduler.prototype, "activityClassHashMap", {
        get: function () {
            return this._activityClassHashMap ? this._activityClassHashMap : {};
        },
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
        set: function (activityClassHashMap) {
            this._activityClassHashMap = activityClassHashMap;
        },
        enumerable: true,
        configurable: true
    });
    return SimpleScheduler;
}());
exports["default"] = SimpleScheduler;
