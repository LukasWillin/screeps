"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
var memory_1 = require("./util/memory");
var shortid_1 = require("shortid");
/**
 * @name SimpleKernel
 * @implements {IKernel}
 */
var SimpleKernel = /** @class */ (function () {
    function SimpleKernel(scheduler) {
        this.memory = memory_1["default"]('%.kernel');
        this.scheduler = scheduler;
    }
    /**
     *
     * @param {IActivity} activityClass
     * @param {IActivityEntity} activityInstance
     * @returns {Function} An activity aware call function.
     */
    SimpleKernel.prototype.callFactory = function (activityClass, activityInstance) {
        var ths = {};
        var activityScope = activityInstance.scope;
        /**
         * Calls the instruction requested by the caller.
         * It creates a new executionState / scope for that instruction and
         * executed it automatically with 'next'.
         * @param {string} instruction - Name of the instruction.
         * @param  {...any} args
         */
        function callFn(instruction) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            var execState = {
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
        callFn.init = function () {
            // TODO: What does it initialize? _> ths with necessary runtime instances like buildings and creeps.
            activityClass.init(ths, activityInstance.scope);
        };
        callFn.next = function () {
            var _a;
            var execState = activityInstance.execStack[0];
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
            try {
                // Call the 'instruction-function' at 'index' in 'instruction'
                var execOk = (_a = activityClass[execState.instr][execState.index]).call.apply(_a, __spreadArrays([ths,
                    ths,
                    activityScope,
                    execState.scope,
                    callFn,
                    execState.err], execState.args));
                execState.index++;
                // TODO: What if execOk false?
            }
            catch (error) {
                execState.err = error;
            }
            // When the run method return truthy -> repeat
            if (activityInstance.execStack.length === 0 && execOk)
                callFn('run');
        };
        return callFn;
    };
    SimpleKernel.prototype.spawn = function (activityType, initialScope, prio) {
        var id = shortid_1["default"].generate();
        var activityInstance = {
            class_: activityType,
            id: id,
            mem: memory_1["default"]("act" + id),
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
    };
    SimpleKernel.prototype.tick = function () {
        this.scheduler.init(Game.cpu.limit, this.callFactory);
    };
    return SimpleKernel;
}());
exports["default"] = SimpleKernel;
