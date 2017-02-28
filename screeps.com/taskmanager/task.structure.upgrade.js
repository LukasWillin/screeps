/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('task.structure.upgrade');
 * mod.thing == 'a thing'; // true
 */

module.exports = {
    /** @param {Creep} creep 
        @param {taskObject} task object to be run
    **/
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
	
	createObject: function(progressPercentage, urgencyLvl, targetId, sourceId) {
	    var room = Game.getObjectById(targetId).room.name;
	    //var subs = this.subTasks(progressPercentage, urgencyLvl, targetId, sourceId);
	    return new this.object(this.NAME_BASE, this.MODULE, progressPercentage, urgencyLvl, targetId, sourceId, room);
	},
	
	object: function(nameBase, module, progressPercentage, urgencyLvl, targetId, sourceId, room, subs) {
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
	        
	        // TODO: Add more properties if required
	},
	
	subTasks: function(progressPercentage, urgencyLvl, targetId, sourceId) {
	    var subs = {};
	    return subs;
	},
	
	NAME_BASE: 'taskUpgrade',
	
	MODULE:'task.structure.upgrade'
};