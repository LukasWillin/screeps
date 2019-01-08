
class PerformanceIndicator {
    constructor(activityID, startCpu, startPriority, staticPriority) {
        this.activityID = activityID;
        this.cpu = startCpu;
        this.priority = startPriority;
        this.staticPriority = staticPriority;
        this.lastRunTick = Game.time - 1000;
    }
}

module.exports = PerformanceIndicator;
