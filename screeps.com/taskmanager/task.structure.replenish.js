/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('task.structure.replenish');
 * mod.thing == 'a thing'; // true
 */

module.exports = {
    /** @param {creep} creep 
        @param {taskObject} task object to be run
    */
    run: function(creep, taskObject) {
        
        var target = Game.getObjectById(taskObject.targetId);
        if(target.energy === target.energyCapacity) {
            taskObject = undefined;
            
        } else {
            if(creep.carry.energy < creep.carryCapacity) {
	            creep.harvestEnergy();
                
            } else {
                if(creep.transfer(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    creep.cachedMoveTo(target);
                } else {
                    if(target.energy == target.energyCapacity) {
                        taskObject = undefined;
                    }
                }
            }
        }
        
        return taskObject;
	},
	
	createObject: function(progressPercentage, urgencyLvl, targetId, sourceId) {
	    var roomName = Game.getObjectById(targetId).room.name;
	    //var subs = this.subTasks(progressPercentage, urgencyLvl, targetId, sourceId);
	    return new this.object(this.NAME_BASE, this.MODULE, progressPercentage, urgencyLvl, targetId, sourceId, roomName);
	},
	
	object: function(nameBase, module, progressPercentage, urgencyLvl, targetId, sourceId, roomName, subTasks) {
        this.nameBase = nameBase;
        this.module = module;
        this.room = roomName;
	    
	    this.creatorId = '';
	    this.sourceId = sourceId;
	    this.subTasks = subTasks;
	    this.targetId = targetId;
	    this.progressPercentage = progressPercentage;
	    this.urgencyLvl = urgencyLvl;
	    this.factor = 0.6;
	    
	    this.requiredBodyParts = [WORK, MOVE, CARRY];
	},
	
	/**
	 * returns subTasks needed to complete this task
	 */
	subTasks: function(progressPercentage, urgencyLvl, targetId, sourceId) {
	    var subs = {};
	    return subs;
	},
	
	NAME_BASE: 'taskReplenish',
	
	MODULE: 'task.structure.replenish'
};