/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('wrapper.creep');
 * mod.thing == 'a thing'; // true
 */

module.exports = {
    
    cachedMoveTo: function(creep, fromX, fromY, toX, toY) {
        
    },
    
    cachedMoveTo: function(creep, from, to) {
        
    },
    
    cachedMoveTo: function(creep, toX, toY) {
        
    },
    
    cachedMoveTo: function(creep, to) {
        
        if (creep.lastPos === undefined)
            creep.memory.lastPos = {};
        if (creep.memory.lastPos.x === undefined) 
            creep.memory.lastPos.x = creep.pos.x - 1;
        if (creep.memory.lastPos.y === undefined) 
            creep.memory.lastPos.y = creep.pos.y - 1;
        
        var manager_path = require('manager.path');
        var result = manager_path.getBestNextStep(creep.memory.lastPos.x, creep.memory.lastPos.y, creep.room.name, creep.pos.x, creep.pos.y, to.room.name, to.pos.x, to.pos.y);
        if(result !== undefined) {
            
            //console.log("Dir calc success");
            
            if(creep.name === "Henry") console.log(JSON.stringify(result).concat(creep.pos.x,",", creep.pos.y));
            if (result.x - creep.pos.x === 1 && result.y - creep.pos.y === 1) creep.move(BOTTOM_RIGHT);
            else if (result.x - creep.pos.x === 1 && result.y - creep.pos.y === 0) creep.move(RIGHT);
            else if (result.x - creep.pos.x === 1 && result.y - creep.pos.y === -1) creep.move(TOP_RIGHT);
            else if (result.x - creep.pos.x === 0 && result.y - creep.pos.y === 1) creep.move(BOTTOM);
            else if (result.x - creep.pos.x === 0 && result.y - creep.pos.y === 0) ; // STAY
            else if (result.x - creep.pos.x === 0 && result.y - creep.pos.y === -1) creep.move(TOP);
            else if (result.x - creep.pos.x === -1 && result.y - creep.pos.y === 1) creep.move(BOTTOM_LEFT);
            else if (result.x - creep.pos.x === -1 && result.y - creep.pos.y === 0) creep.move(LEFT);
            else if (result.x - creep.pos.x === -1 && result.y - creep.pos.y === -1) creep.move(TOP_LEFT);
            
            creep.memory.lastPos.x = creep.pos.x;
            creep.memory.lastPos.y = creep.pos.y;
            
        } else {
            //console.log("Result of -manager.path-.getBestNextStep returned undefined -> using standard moveTo on ".concat(creep, " to target ", to));
            creep.moveTo(to, {visualizePathStyle: {stroke: '#ff5555'}});
        }
    },
    
    moveOnMostUsed: function(creep, fromX, fromY, toX, toY) {
        
    },
    
    clearTaskInfo(creep) {
        delete creep.memory.taskInfo;
    }
};