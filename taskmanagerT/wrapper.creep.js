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
            creep.lastPos = {};
        if (creep.lastPos.x == undefined) 
            creep.lastPos.x = creep.pos.x;
        if (creep.lastPos.y == undefined) 
            creep.lastPos.y = creep.pos.y;
        
        
    },
    
    moveOnMostUsed: function(creep, fromX, fromY, toX, toY) {
        
    },
    
    clearTaskInfo(creep) {
        delete creep.memory.taskInfo;
    }
};