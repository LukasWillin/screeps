/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('wrapper.creep');
 * mod.thing == 'a thing'; // true
 */

module.exports = {
    
	WrappedCreep: function(creep) {
	    
	    this.memory = creep.memory;
	    
	    this.moveTo = creep.moveTo;
	    
	    this.moveByPath = creep.moveByPath;
	    
	    this.room = creep.room;
	    
	    this.pos = creep.pos;
	    
	    this.reserveController = creep.reserveController;
		
		this.cachedMoveTo = function(to) {
			
			if(creep.memory.lastPos === undefined)
				creep.memory.lastPos = {};
		  
			var manager_path = require('manager.path');
			var result = manager_path.getBestNextPos(creep.memory.lastPos.x, creep.memory.lastPos.y, creep.room.name, creep.pos.x, creep.pos.y, to.room.name, to.pos.x, to.pos.y);
			
			if(creep.name === "Landon") console.log(JSON.stringify(result));
			
			if(result !== undefined) {
				
				//if (creep.name ==console.log("Dir calc success");
				
				//if(creep.name === "Makayla") console.log(JSON.stringify(result).concat( creep.pos.x ,",", creep.pos.y, " - last ", creep.memory.lastPos.x, ",", creep.memory.lastPos.y));
				
				if (result.x == 1 && result.y == 1) creep.move(BOTTOM_RIGHT);
				else if (result.x == 1 && result.y == 0) creep.move(RIGHT);
				else if (result.x == 1 && result.y == -1) creep.move(TOP_RIGHT);
				else if (result.x == 0 && result.y == 1) creep.move(BOTTOM);
				else if (result.x == 0 && result.y == 0) ; // STAY
				else if (result.x == 0 && result.y == -1) creep.move(TOP);
				else if (result.x == -1 && result.y == 1) creep.move(BOTTOM_LEFT);
				else if (result.x == -1 && result.y == 0) creep.move(LEFT);
				else if (result.x == -1 && result.y == -1) creep.move(TOP_LEFT);
				
			} else {
				//console.log("Result of -manager.path-.getBestNextStep returned undefined -> using standard moveTo on ".concat(creep, " to target ", to));
				creep.moveTo(to, {visualizePathStyle: {stroke: '#ff5555'}, ignoreCreeps: false, reusePath: 10});
				
				
			}
			creep.memory.lastPos.x = creep.pos.x;
			creep.memory.lastPos.y = creep.pos.y;
		}
	},
	
    cachedMoveTo: function(creep, fromX, fromY, toX, toY) {
        
    },
    
    cachedMoveTo: function(creep, from, to) {
        
    },
    
    cachedMoveTo: function(creep, toX, toY) {
        
    },
    
    cachedMoveTo: function(creep, to) {
		
		if(creep.memory.move === undefined)
			creep.memory.move = {};
		
		if(creep.memory.move.dest === undefined)
			creep.memory.move.dest = {};
		
		if(creep.memory.move.lastPos === undefined)
			creep.memory.move.lastPos = {};
      
        var manager_path = require('manager.path');
		
		var result;
		if (creep.memory.move.lastPos.x && creep.memory.move.lastPos.y) {
			result = manager_path.getBestNextPos(creep.memory.move.lastPos.x, creep.memory.move.lastPos.y, creep.room.name, creep.pos.x, creep.pos.y, to.room.name, to.pos.x, to.pos.y);
		}
        
		if(creep.name === "Owen") console.log(JSON.stringify(result));
		
		if(result !== undefined) {
            
            //if (creep.name ==console.log("Dir calc success");
            
            if(creep.name === "Makayla") console.log(JSON.stringify(result).concat( creep.pos.x ,",", creep.pos.y, " - last ", creep.memory.lastPos.x, ",", creep.memory.lastPos.y));
			
            if (result.x == 1 && result.y == 1) creep.move(BOTTOM_RIGHT);
            else if (result.x == 1 && result.y == 0) creep.move(RIGHT);
            else if (result.x == 1 && result.y == -1) creep.move(TOP_RIGHT);
            else if (result.x == 0 && result.y == 1) creep.move(BOTTOM);
            else if (result.x == 0 && result.y == 0) ; // STAY
            else if (result.x == 0 && result.y == -1) creep.move(TOP);
            else if (result.x == -1 && result.y == 1) creep.move(BOTTOM_LEFT);
            else if (result.x == -1 && result.y == 0) creep.move(LEFT);
            else if (result.x == -1 && result.y == -1) creep.move(TOP_LEFT);
			
			creep.memory.move.path = undefined;
			
        } else {
            //console.log("Result of -manager.path-.getBestNextStep returned undefined -> using standard moveTo on ".concat(creep, " to target ", to));
			creep.moveTo(to, {visualizePathStyle: {stroke: '#ff5555'}, ignoreCreeps: false, reusePath: 6});
			
			creep.memory.move.path = creep.memory._move.path;
		}
		
		creep.memory.move.lastPos.x = creep.pos.x;
        creep.memory.move.lastPos.y = creep.pos.y;
		
		creep.memory.move.time = Game.time;
		creep.memory.move.room = creep.room.name;
		
		// path stays untouched unless a cached result has been returned
		
		creep.memory.move.dest.x = to.pos.x;
		creep.memory.move.dest.y = to.pos.y;
		creep.memory.move.dest.room = to.room.name;
    },
    
    moveOnMostUsed: function(creep, fromX, fromY, toX, toY) {
        
    },
    
    clearTaskInfo(creep) {
        delete creep.memory.taskInfo;
    }
};