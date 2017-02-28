/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('extension.creep');
 * mod.thing == 'a thing'; // true
 */

module.exports = {
    
    extendCreep: function(creep) {
	    
	    creep.cachedMoveTo = function(to) {
			var manager_path = require('manager.path');
			
			if(this.memory.move === undefined)
			    this.memory.move = {};
			if(this.memory.move.lastPos === undefined)
				this.memory.move.lastPos = {};
		    
			var result = manager_path.getBestNextDir(this.memory.move.lastPos.x, this.memory.move.lastPos.y, this.room.name, this.pos.x, this.pos.y, to.room.name, to.pos.x, to.pos.y);
			
			if(result !== undefined) {
				this.moveInDir(result.x, result.y);
			} else {
				var path = this.pos.findPathTo(to, { ignoreCreeps: false });
    		    console.log("Creating path... ".concat(this));
    		    manager_path.logPathToPositions(path, this.pos.roomName, to);
			}
			this.memory.move.lastPos.x = this.pos.x;
			this.memory.move.lastPos.y = this.pos.y;
		};
		
		creep.moveInDirToPos = function(x, y) {
		    
		    x = Math.floor(x - this.pos.x) % 2;
		    y = Math.floor(y - this.pos.y) % 2;
		    
		    this.moveInDir(x, y);
		};
		
		creep.moveInDir = function(x, y) {
		    if (x == 1 && y == 1) this.move(BOTTOM_RIGHT);
			else if (x == 1 && y == 0) this.move(RIGHT);
			else if (x == 1 && y == -1) this.move(TOP_RIGHT);
			else if (x == 0 && y == 1) this.move(BOTTOM);
			else if (x == 0 && y == 0) ; // STAY
			else if (x == 0 && y == -1) this.move(TOP);
			else if (x == -1 && y == 1) this.move(BOTTOM_LEFT);
			else if (x == -1 && y == 0) this.move(LEFT);
			else if (x == -1 && y == -1) this.move(TOP_LEFT);
		};
		
		creep.harvestEnergy = function() {
    
            if (this.memory.actions === undefined)
                this.memory.actions = {};
            
            if (this.memory.actions.harvest === undefined)
                this.memory.actions.harvest = {};
    
            if(this.memory.actions.harvest.sourceId === undefined) {
                
                var sourceId = this.findOptimalSource();
                this.memory.actions.harvest.sourceId = sourceId;
            }
            
    	    if(this.carry.energy < this.carryCapacity) {
    	        var source = Game.getObjectById(this.memory.actions.harvest.sourceId);
                if(this.harvest(source) == ERR_NOT_IN_RANGE)
                    this.cachedMoveTo(source);
            } else {
                delete this.memory.actions.harvest.sourceId;
            }
    	},
    	
    	creep.findOptimalSource = function() {
    	    var sourceId;
    	    
    	    var sourceList = this.room.find(FIND_SOURCES);
                
            sourceList = _.sortBy(sourceList, function(obj) {
                // using creep since this isnt refering to the right object
                return Math.abs(creep.pos.x - obj.pos.x) + Math.abs(creep.pos.y - obj.pos.y);
            });
            
            for(var i = 0; i < sourceList.length; i++) {
                sourceList[i].freePos = 0; 
                var source = sourceList[i];
                
                // Check if enough miningSpots are available
                for(var xi = source.pos.x - 1; xi <= source.pos.x + 1; xi++) {
                    for(var yi = source.pos.y - 1; yi <= source.pos.y + 1; yi++) {
                        
                        if(xi === source.pos.x && yi === source.pos.y)
                            yi++;
                        
                        var posObjArr; var posObj;
                        
                        if(xi >= 0 && xi < 50 && yi >= 0 && yi < 50) {
			                posObjArr = this.room.lookAt(xi, yi);
                			posObj = posObjArr[0]; //posObjArray.length-1];
                		}
                		
                		if( posObj && posObj['type'] == 'terrain' && !(posObj['terrain'] == 'wall') )
                		    sourceList[i].freePos += 1;
            }   }   }
            
            for (var j = 3; j >= 0 && (sourceId === undefined); j--) {
                for(var i = 0; i < sourceList.length && (sourceId === undefined); i++) {
                    if(sourceList[i].freePos >= j) 
                        sourceId = sourceList[i].id;
            }   }
                
            return sourceId;
    	},
    	
    	/** When a creep is member of a company or/and a battalion
    	 * 
    	 */
    	creep.generalMemory = function(memoryObject) {
    	    
    	}
		
	}
};