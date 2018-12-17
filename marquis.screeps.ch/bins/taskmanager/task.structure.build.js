/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('task.structure.build');
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
        if(creep.memory.taskInfo.building === undefined) {
            creep.memory.taskInfo.building = false;
        }
        
	    if(creep.carry.energy === 0) {
            creep.memory.taskInfo.building = false;
            //creep.say('🔄 harvest');
	    } 
	    if(creep.carryCapacity === creep.carry.energy) {
	        creep.memory.taskInfo.building = true;
	    }
	    else {
	        
	        //creep.say('🚧 build');
	    }

	    if(creep.memory.taskInfo.building) {
	        var target = Game.getObjectById(taskObject.targetId);
            if(target != null) {
                if(creep.build(target) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                } else {
                    taskObject.progressPercentage = taskObject.progressPercentage + 1; //(target.progress/target.progressTotal)*100;
                }
            }
            if (taskObject.progressPercentage >= 100) { taskObject = undefined; }
            else if(target == null) { taskObject = undefined; }
            
            
	    }
	    else {
	        creep.harvestEnergy();
	    }
	    
	    return taskObject;
	},
	
	subTasks: function() {
	    // TODO: Return needed tasks as object
	},
	
	createObject: function(progressPercentage, urgencyLvl, targetId, sourceId) {
	    var room = Game.getObjectById(targetId).room.name;
	    return new this.object(this.NAME_BASE, this.MODULE, progressPercentage, urgencyLvl, targetId, sourceId, room);
	},
	
	object: function(nameBase, module, progressPercentage, urgencyLvl, targetId, sourceId, room) {
	        this.nameBase = nameBase;
	        this.module = module;
	        this.room = room;
	        
	        this.creatorId = ''; // will be set after creation
	        this.progressPercentage = progressPercentage;
	        this.urgencyLvl = urgencyLvl;
	        this.subTasks = {};
	        this.factor = 0.01;
	        this.assignedCreeps = [];
	        
	        this.targetId = targetId;
	        this.sourceId = sourceId;
	        this.requiredBodyParts = [WORK, MOVE, CARRY];
	        // TODO: Add more properties if required
	},
	
	NAME_BASE: 'taskBuild',
	
	MODULE:'task.structure.build'
}