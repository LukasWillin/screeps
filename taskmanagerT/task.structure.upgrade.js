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
        
        if(creep.memory.taskInfo === undefined) {
            creep.memory.taskInfo = {};
        }
        if(creep.memory.taskInfo.upgrading === undefined) {
            creep.memory.taskInfo.upgrading = true;
        }
        
        if(creep.memory.taskInfo.upgrading && creep.carry.energy == 0) {
            taskObject.sourceId = undefined;
            
            creep.memory.taskInfo.upgrading = false;
            //creep.say('🔄 harvest');
	    }
	    
	    if(!creep.memory.taskInfo.upgrading && creep.carry.energy == creep.carryCapacity) {
	        creep.memory.taskInfo.upgrading = true;
	        //creep.say('⚡ upgrade');
	        
	        //if (taskObject.sourceId === undefined) {
            //    taskObject.sourceId = creep.room.find(FIND_SOURCES)[0].id;
            //}
	    }

	    if(creep.memory.taskInfo.upgrading) {
	        //delete creep.memory.taskInfo.subTasks.harvest.sourceId;
	        
            if(creep.upgradeController(creep.room.controller) === ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
            } else {
                taskObject.progressPercentage = taskObject.progressPercentage + 0.5;
            }
            if (creep.energy == 0) {
                /*
                console.log("Updating Progress percentage for "+ taskObject.nameBase);
                taskObject.progressPercentage = taskObject.progressPercentage + 10;
                taskObject.sourceId = undefined;
                */
            }
            
        } else {
            
            /*var source = creep.room.find(FIND_SOURCES)[0];
            
            if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
            }
            taskObject.sourceId = source.id;*/
            var taskHarvestMod = require('task.source.harvest');
	        taskHarvestMod.run(creep, taskObject.subTasks['harvest']);
	        
        }
        
        
        if(taskObject.progressPercentage >= 100) {
            taskObject = undefined;
            delete creep.memory.taskInfo.upgrading;
        }
        
        return taskObject;
	},
	
	createObject: function(progressPercentage, urgencyLvl, targetId, sourceId) {
	    var room = Game.getObjectById(targetId).room.name;
	    var subs = this.subTasks(progressPercentage, urgencyLvl, targetId, sourceId);
	    return new this.object(this.NAME_BASE, this.MODULE, progressPercentage, urgencyLvl, targetId, sourceId, room, subs);
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
	    var task_source_harvest = require('task.source.harvest');
	    subs['harvest'] = task_source_harvest.createObject(0, 1, targetId);
	    return subs;
	},
	
	NAME_BASE: 'taskUpgrade',
	
	MODULE:'task.structure.upgrade'
};