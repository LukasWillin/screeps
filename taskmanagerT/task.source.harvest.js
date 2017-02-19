
/**
 * Deprecated Task > too small > use replenish instead
 */
module.exports = {
    /** @param {creep} creep 
        @param {taskObject} task object to be run
    */
    run: function(creep, taskObject) {
        
        if (creep.memory.taskInfo === undefined) 
            creep.memory.taskInfo = {};
        if (creep.memory.taskInfo.subTasks === undefined) 
            creep.memory.taskInfo.subTasks = {};
        if (creep.memory.taskInfo.subTasks.harvest === undefined)
            creep.memory.taskInfo.subTasks.harvest = {};

        if(creep.memory.taskInfo.subTasks.harvest.sourceId === undefined) {
            
            var structure = Game.getObjectById(taskObject.targetId);
            var sourceList = structure.room.find(FIND_SOURCES);
            
            sourceList = _.sortBy(sourceList, function(obj) {
                return Math.abs(structure.pos.x - obj.pos.x) + Math.abs(structure.pos.y - obj.pos.y);
            });
            
            for(var i = 0; i < sourceList.length; i++) {
                sourceList[i].freePos = 0; var source = sourceList[i];
                
                // Check if enough miningSpots are avalable
                for(var xi = source.pos.x - 1; xi <= source.pos.x + 1; xi++) {
                    for(var yi = source.pos.y - 1; yi <= source.pos.y + 1; yi++) {
                        var posObjArr; var posObj;
                        if(xi >= 0 && xi < 50 && yi >= 0 && yi < 50) {
			                posObjArr = structure.room.lookAt(xi, yi);
			                //console.log(JSON.stringify(posObjArr));
                			posObj = posObjArr[0]; //posObjArray.length-1];
                		}
                		if( posObj && posObj['type'] == 'terrain' && !(posObj['terrain'] == 'wall') ) sourceList[i].freePos += 1;
                    }
                }
            }
            
            for (var j = 3; j >= 0 && (creep.memory.taskInfo.subTasks.harvest.sourceId === undefined); j--) {
                for(var i = 0; i < sourceList.length; i++) {
                    if(sourceList[i].freePos >= j && source !== undefined) creep.memory.taskInfo.subTasks.harvest.sourceId = sourceList[i].id;
                }
            }
            
        }
        
	    if(creep.carry.energy < creep.carryCapacity) {
            var source = Game.getObjectById(creep.memory.taskInfo.subTasks.harvest.sourceId);
            if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                var wrapper_creep = require('wrapper.creep');
                wrapper_creep.cachedMoveTo(creep, source);
                //creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
            }
            
        } else {
            taskObj = undefined;
            delete creepObject.memory.taskInfo.subTasks.harvest.sourceId;
        }
        
        return taskObject;
	},
	
	createObject: function(progressPercentage, urgencyLvl, targetId, sourceId) {
	    var room = Game.getObjectById(targetId).room.name;
	    sourceId = undefined;
	    return new this.object(this.NAME_BASE, this.MODULE, progressPercentage, urgencyLvl, targetId, sourceId, room);
	},
	
	object: function(nameBase, module, progressPercentage, urgencyLvl, targetId, sourceId, room, subTasks) {
        this.nameBase = nameBase;
        this.module = module;
        this.room = room;
	    
	    this.creatorId = '';
	    this.subTasks = subTasks;
	    this.sourceId = sourceId;
	    this.targetId = targetId;
	    this.progressPercentage = progressPercentage;
	    this.urgencyLvl = urgencyLvl;
	    this.factor = 0.1;
	    
	    this.requiredBodyParts = [WORK, MOVE, CARRY];
	},
	
	/**
	 * returns subTasks needed to complete this task
	 */
	subTasks: function() {
	    return undefined;
	},
	
	/** Deprecated > use property NAME_BASE instead
	 * TODO remoce
	 * returns the name base
	 */
	getNameBase: function() { // TODO getter deprecated
	    return 'taskHarvest';
	},
	
	NAME_BASE: 'taskHarvest',
	
	/** Deprecated > use property MODULE instead
	 * TODO remoce
	 * returns the module
	 */
	getModule: function() { // TODO getter deprecated
	    return 'task.source.harvest';
	},
	
	MODULE: 'task.source.harvest'
};