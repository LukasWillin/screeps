/*
 * REPLACE WITH MANAGER.TASK
 */
var util_task = require('util.task');

module.exports = {
    
    checkForTasks: function(structure){
        if(structure.structureType === STRUCTURE_SPAWN) {
            this.check_Spawn_ForTasks(structure);
            
        } else if (structure.structureType === STRUCTURE_CONTROLLER) {
            this.check_Controller_ForTasks(structure);
            
        } else if (structure.structureType === STRUCTURE_EXTENSION) {
            this.check_Extension_ForTasks(structure);
        } else if (structure.structureType === STRUCTURE_TOWER) {
            this.check_Tower_ForTasks(structure);
        }
    },
    
    // >>>> TASK METHODS BY STRUCTURE TYPE
    check_Controller_ForTasks: function(structure) {
        this.createUpgradeTask(structure);
    },
    
    check_Spawn_ForTasks: function(structure) {
        // Energy Management
        if(structure.energy < structure.energyCapacity) {
            this.createReplenishEnergyTask(structure);
            
        }
        
        // ************ Creep Creation :: TODO move to new function
        // TODO check energy total and then spawn the biggest creep possible
        //if(Object.keys(Game.rooms).length === 1) {
            if(Object.keys(Game.creeps).length === 0) {
                
            }
            if( (3 - Object.keys(Game.creeps).length) > 0) {
                var mng_creep = require('manager.creep');
                var creepName = Game.spawns[Object.keys(Game.spawns)[0]].createCreep(mng_creep.WORKER_CLASS.LVL_1);
                var spawningCreep = Game.creeps[creepName];
                    spawningCreep.memory.task = undefined;
                    spawningCreep.memory.taskInfo = undefined;
                    spawningCreep.memory.affiliation = {};
                    spawningCreep.memory.affiliation.controllerId = structure.room.controller.id;
                
            }
        //}
        
        // ************** EXTENSIONS ****************
        var extensionAmount = CONTROLLER_STRUCTURES.extension[structure.room.controller.level]; // gets available amount of extensions
        // Structure extensions available
        var extensionsInStructRoom = _.filter(structure.room.find(FIND_MY_STRUCTURES), function(struct) {
            return (struct.structureType === STRUCTURE_EXTENSION);
        });
        var extensionConstructionSites = _.filter(structure.room.find(FIND_MY_CONSTRUCTION_SITES), function(site) {
            return site.structureType === STRUCTURE_EXTENSION;
        });
        
        extensionAmount = extensionAmount - (extensionsInStructRoom.length + extensionConstructionSites.length);
        
        //extensionAmount = 20; //TODO remove -> only for testing!!!!!! !!!
        
        /*if(extensionAmount > 0) {
            var placements = this.extensionPlacement(structure, extensionAmount);
            
            //console.log("Avalable places for extensions".concat(JSON.stringify(placements)));
            
            for(var key in placements) {
                structure.room.createConstructionSite(placements[key].x, placements[key].y, STRUCTURE_EXTENSION);
            }
        }*/
    },
    
    check_Extension_ForTasks: function(structure) {
        if(structure.energy < structure.energyCapacity) {
            return this.createReplenishEnergyTask(structure);
        }
    },
    
    check_Tower_ForTasks: function(structure) {
        if(structure.energy < structure.energyCapacity) {
            this.createReplenishEnergyTask(structure);
        }
    },
    
    // >>>> HELPER METHODS
    createReplenishEnergyTask: function(structure){
        var taskParts = util_task.createTask(structure, 'task.structure.replenish');
        taskParts.controllerId = structure.room.controller.id;
        return util_task.setSharedTask(taskParts.taskObject, taskParts.taskName);
    },
    
    createSpawnCreepTask: function(structure) {
        
    },
    
    createUpgradeTask: function(structure) {
        var taskParts = util_task.createTask(structure,'task.structure.upgrade');
        taskParts.controllerId = structure.room.controller.id;
        return util_task.setSharedTask(taskParts.taskObject, taskParts.taskName);
    },
    
    
    // Need new algo
    // place extension in quad groups
    // place them so:
    //  1.  No adjacent pos has a structure (besides roads, for walls see Nr. 2)
    //  2.  No adjacent* pos is a terrain or structure wall * (Diagonal allowed)
    //  3.  Place them so they populate the middle of the room but such that
    //      3.1. Outgoing from the spawn
    //      3.2. If not too far from center around spawn and between spawn and controller
    extensionPlacement: function(structure, until, x, y, next, ringDistance, placements, guard) {
        //console.log("**************************************************");
        
        if(next === undefined) {
            ringDistance = 2; x = structure.pos.x + ringDistance; y = (structure.pos.y) * (-1);
            placements = {}; next = 0; guard = 0;
        }
        guard++; if (guard == 30) { return ; }
        
        var dirCoords = this.directionAndStep(structure, x, y, ringDistance);
        x = dirCoords.x; y = dirCoords.y;
        
        var absX = Math.abs(x); var absY = Math.abs(y);
        var boolean1 = (absX === structure.pos.x + ringDistance) || (absX === structure.pos.x - ringDistance) || (absY === structure.pos.y + ringDistance) || (absY === structure.pos.y - ringDistance);
        //console.log("absX and absY in range: ".concat(boolean1));
        
        if( boolean1 ) {
            
            //console.log(JSON.stringify(dirCoords));
            // CHECK IF PLACEMENT IS POSSIBLE at absX and absY
            // if yes save this position and iterate next
            
            var result = this.placementPossibleAt(structure, x, y, ringDistance);
            //absX = Math.abs(dirCoords.x); absY = Math.abs(dirCoords.y);
            //console.log("placement is possible: ".concat(result));
            //console.log("absX=".concat(absX, ", absY=", absY), ", next=", next);
			if (result) {//this.placementPossibleAt(structure, x, y, ringDistance)) {
				next++;
				placements[next] = { x:  absX, y: absY };
			}
			
            // *************************************************
            
            // CHECK IF GOAL until HAS BEEN REACHED
            // if yes stop recursiv calls
            if(next === until) { 
                //console.log("Method returned as normal with next=".concat(next));
                return placements; }
            
            
            // IF ALG REACHES THE FIRST POSITION AGAIN THEN RAISE THE ringDistance by 2
            if(absX === structure.pos.x + ringDistance && absY === structure.pos.y) {
                ringDistance = ringDistance + 2;
                dirCoords.x += 2;
            }
            
            var nextIteration = this.extensionPlacement(structure, until, dirCoords.x, dirCoords.y, next, ringDistance, placements, guard);
            
            if(nextIteration) {
                return nextIteration;
            } else {
                return ; //  OOPS!!! Something went wrong
            }
        } else {
            
            return placements; //next position not inside the boundaries -> calculations were wrong
        }
    },
    
	directionAndStep: function(structure, x, y, ringDistance) {
		
		// figure out if direction changes

		if(x >= 0 && y >= 0 &&          Math.abs(x+1) > structure.pos.x + ringDistance) {
			y = y * (-1); // new direction -> negative y -> upwards (onscreen)
			
		} else if(x >= 0 && y < 0 &&    Math.abs(y+1) < structure.pos.y - ringDistance) {
			x = x * (-1); // new direction -> negative x -> left (onscreen)
			
		} else if((x < 0) && (y < 0) &&     (Math.abs(x+1) < (structure.pos.x - ringDistance))) {
			y = y * (-1); // new direction -> positive y -> downwards (onscreen)
			
		} else if(x < 0 && y >= 0 &&    Math.abs(y+1) > structure.pos.y + ringDistance) {
			x = x * (-1); // new direction -> positive x -> right (onscreen)
			
		}
		
		var newX; var newY;
		// figure out y+1 or x+1
		if ( (x >= 0 && y >= 0) || (x < 0 && y < 0) ) {
			newX = x+1; newY = y;

		} else if ( (x >= 0 && y < 0) || (x < 0 && y >= 0) ) {
			newX = x; newY = y+1;
		}
		return { x: newX, y: newY };
	},
	placementPossibleAt: function(structure, x, y, ringDistance) {
		var result = false;
		
		var posObjArray = undefined;
		var posObj = undefined;
		
		var absX = Math.abs(x); var absY = Math.abs(y);
		
		//console.log("absX=".concat(absX, ", absY=", absY));
		if(absX >= 0 && absX < 50 && absY >= 0 && absY < 50) {
			
			posObjArray = structure.room.lookAt(absX, absY);
			posObj = posObjArray[0]; //posObjArray.length-1];
		}
		//console.log(JSON.stringify(posObj));
		
		var inLineAmount = 2;
		if(ringDistance > 2) { inLineAmount = 4; } // no more extensions in a row than 3
		
		if(posObj && posObj['type'] == 'terrain' && !(posObj['terrain'] == 'wall') ) { // pos is free for construction
			
			if ( (x >= 0 && y >= 0) || (x < 0 && y < 0) ) {
				if( (Math.abs(x - structure.pos.x) % inLineAmount === 0) ) { ; }
				else { result = true; }
				
			} else if ( (x >= 0 && y < 0) || (x < 0 && y >= 0) ) {
				if( (Math.abs(y - structure.pos.y) % inLineAmount === 0) ) { ; }
				else { result = true; }
			}
		}
		return result;
	}
};