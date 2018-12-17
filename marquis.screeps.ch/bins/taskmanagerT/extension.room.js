/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('extension.room');
 * mod.thing == 'a thing'; // true
 */

var util_memory = require('util.memory');

module.exports = {
    
    extend: function(room) {
        
        room.memory = function() {
            return util_memory.getMemory('rooms', { identifier: room.name });
        }();
        
        room.memory.pathCache = function(){
            return Memory.posList;
        }();
        
        
        
    }
    
};