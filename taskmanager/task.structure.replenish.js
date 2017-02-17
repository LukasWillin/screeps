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
    run: function(creepObject, taskObject) {
        
        var target = Game.getObjectById(taskObject.targetId);
        if(target.energy === target.energyCapacity) {
            taskObject = undefined;
        } else {
            if(creepObject.carry.energy < creepObject.carryCapacity) {
	        
    	        //if(taskObject.sourceId === undefined) {
    	            //var structure = Game.getObjectById(taskObject.targetId);
    	            //taskObject.sourceId = structure.room.find(FIND_SOURCES)[0].id;
    	        //}
    	        var taskHarvestMod = require('task.source.harvest');
    	        var taskHarvest = taskHarvestMod.run(creepObject, taskObject.subTasks.harvest);
    	        
                //var source = Game.getObjectById(taskObject.sourceId);
                //if(creepObject.harvest(source) === ERR_NOT_IN_RANGE) {
                //    creepObject.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
                //}
                
            } else {
                //delete creepObject.memory.taskInfo.subTasks.harvest.sourceId;
                
                
                
                if(creepObject.transfer(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    creepObject.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                } else {
                    creepObject.memory.taskInfo.subTasks.harvest.sourceId = undefined;
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
	    var subs = this.subTasks(progressPercentage, urgencyLvl, targetId, sourceId);
	    return new this.object(this.NAME_BASE, this.MODULE, progressPercentage, urgencyLvl, targetId, sourceId, roomName, subs);
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
	    var task_source_harvest = require('task.source.harvest');
	    subs['harvest'] = task_source_harvest.createObject(0, 1, targetId);
	    return subs;
	},
	
	NAME_BASE: 'taskReplenish',
	
	MODULE: 'task.structure.replenish'
};