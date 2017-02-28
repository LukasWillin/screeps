

module.exports = {
    
    /** 
     * Executes the task on the given creep.
     * @param {Creep} creep
     * @param {TaskObject} taskObject
     * @return {TaskObject} taskObject - The altered taskObject. Is undefined upon completion.
     */
    run: function(creep, taskObject) {
        
        if(creep.memory.taskInfo === undefined )
            creep.memory.taskInfo = {};
        if(creep.memory.taskInfo.upgrading === undefined)
            creep.memory.taskInfo.upgrading = true;
        
        if(creep.memory.taskInfo.upgrading && creep.carry.energy == 0) {
            creep.memory.taskInfo.upgrading = false;
            //creep.say('🔄 harvest');
	    }
	    
	    if(!creep.memory.taskInfo.upgrading && creep.carry.energy == creep.carryCapacity)
	        creep.memory.taskInfo.upgrading = true;

	    if(creep.memory.taskInfo.upgrading) {
            if(creep.upgradeController(creep.room.controller) === ERR_NOT_IN_RANGE) {
                creep.cachedMoveTo(creep.room.controller);
            } else {
                taskObject.progressPercentage = taskObject.progressPercentage + 1;
            }
            
        } else {
	        creep.harvestEnergy();
        }
        
        
        if(taskObject.progressPercentage >= 100) {
            taskObject = undefined;
            delete creep.memory.taskInfo.upgrading;
        }
        
        return taskObject;
	},
	
	/** Use this to get a new TaskObject.
	 * 
	 * @param {number} progressPercentage - Percent value indicating the progression of the task.
	 * @param {number} urgencyLvl - A base value indicating how urgent the task is. 
	 * This can have an impact on task selection by {@link manager.task#getTaskByBody}
	 * @param {string} targetId - Id of the target.
	 * @param {string} sourceId - Id of the source.
	 * 
	 * @return {TaskObject} TaskObject - TaskObject for this module which can again be executed by this module {@see run}.
	 */
	createObject: function(progressPercentage, urgencyLvl, targetId, sourceId) {
	    var room = Game.getObjectById(targetId).room.name;
	    //var subs = this.subTasks(progressPercentage, urgencyLvl, targetId, sourceId);
	    return new this.Object(this.NAME_BASE, this.MODULE, progressPercentage, urgencyLvl, targetId, sourceId, room);
	},
	
	/**
	 * Creates subtasks used to complete this task.
	 * 
	 * @param {number} progressPercentage - Percent value indicating the progression of the task.
	 * @param {number} urgencyLvl - A base value indicating how urgent the task is. 
	 * This can have an impact on task selection by {@link manager.task#getTaskByBody}
	 * @param {string} targetId - Id of the target.
	 * @param {string} sourceId - Id of the source.
	 * 
	 * @return {Object} An object containing all sub TaskObject's.
	 */
	subTasks: function(progressPercentage, urgencyLvl, targetId, sourceId) {
	    var subs = {};
	    return subs;
	},
	
	/** Creates a TaskObject. Should only be called from within this module.
	 * @constructor
	 * 
	 * @param {string} nameBase
	 * @param {string} module - Name of the module.
	 * @param {number} progressPercentage - Percent value indicating the progression of the task.
	 * @param {number} urgencyLvl - A base value indicating how urgent the task is. 
	 * This can have an impact on task selection by {@link manager.task#getTaskByBody}
	 * @param {string} targetId - Id of the target.
	 * @param {string} sourceId - Id of the source.
	 * @param {string} room - Name of the room.
	 * @param {Object} subs - Object containing alls sub tasks.
	 * 
	 * @return {TaskObject} TaskObject - TaskObject for this module which can again be executed by this module {@see run}.
	 */
	Object: function(nameBase, module, progressPercentage, urgencyLvl, targetId, sourceId, room, subs) {
	        this.nameBase = nameBase;
	        this.module = module;
	        this.room = room;
	        
	        this.creatorId = ''; // will be set after creation
	        this.progressPercentage = progressPercentage;
	        this.urgencyLvl = urgencyLvl;
	        this.subTasks = subs;
	        this.factor = 0.5;
	        this.assignedCreeps = [];
	        
	        this.sourceId = sourceId;
	        this.targetId = targetId;
	        
	        this.requiredBodyParts = [WORK, MOVE, CARRY];
    },
	
	/** @const {string} */
	NAME_BASE: 'taskUpgrade',
	
	/** @const {string} */
	MODULE:'task.structure.upgrade'
};