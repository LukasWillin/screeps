
class IActivityEntity {
    /**
     * 
     * @param {string} activityType - Registered type of the activity.
     * @param {Object} state - The memory of the activity. 
     * @param {Object} usageStats - Statisitcs about its resource usage.
     * @param {Array<Object>} executionStack - The execution stack in order to be able to resume it later.
     */
    constructor(activityType, state, usageStats, executionStack) { }
}

module.exports = IActivityEntity;