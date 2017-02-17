/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('manager.path');
 * mod.thing == 'a thing'; // true
 */

module.exports = {
    
    logPositions() {
        for(var creepName in Game.creeps) {
            var creep = Game.creeps[creepName];
            this.logPosition(creep, creep.pos.x, creep.pos.y);
        }
    },
    
    logPosition(creep, x, y) {
        var roomName = creep.room.name;
        
        if(Memory.posList === undefined) Memory.posList = {};
        if(Memory.posList[roomName] === undefined) Memory.posList[roomName] = {};
        if(Memory.posList[roomName][x] === undefined) Memory.posList[roomName][x] = {};
        if(Memory.posList[roomName][x][y] === undefined) Memory.posList[roomName][x][y] = {};
        if(Memory.posList[roomName][x][y].count === undefined) Memory.posList[roomName][x][y].count = 0;
        
        Memory.posList[roomName][x][y].count = Memory.posList[roomName][x][y].count + 1;
        var dest
        if(creep.memory._move) {
            if(creep.memory._move.dest) {
                dest = creep.memory._move.dest;
                if(Memory.posList[roomName][x][y].dests === undefined)
                    Memory.posList[roomName][x][y].dests = {};
                if(Memory.posList[roomName][x][y].dests[dest.room] === undefined)
                    Memory.posList[roomName][x][y].dests[dest.room] = {};
                if(Memory.posList[roomName][x][y].dests[dest.room][dest.x] === undefined)
                    Memory.posList[roomName][x][y].dests[dest.room][dest.x] = {};
                if(Memory.posList[roomName][x][y].dests[dest.room][dest.x][dest.y] === undefined)
                    Memory.posList[roomName][x][y].dests[dest.room][dest.x][dest.y] = {};
                if(Memory.posList[roomName][x][y].dests[dest.room][dest.x][dest.y].count === undefined)
                    Memory.posList[roomName][x][y].dests[dest.room][dest.x][dest.y].count = 0;
                    
                Memory.posList[roomName][x][y].dests[dest.room][dest.x][dest.y].count += 1;
            }
        }
    },
    
    calcPathsFromLoggedPositions() {
        
    }
};