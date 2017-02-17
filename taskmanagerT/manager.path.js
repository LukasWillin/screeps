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
    
    getBestNextStep(lastX, lastY, fromRoomName, fromX, fromY, toRoomName, toX, toY) {
        if(fromRoomName !== toRoomName) {
            return undefined;
        }
        
        var oldDir = {};
        oldDir.x = fromX - lastX;
        oldDir.y = fromY - lastY;
        
        var newDir = {};
        var lastHighestCount = 0;
        var currCount = 0;
        
        var newX = fromX + oldDir.x;
        var newY = fromY + oldDir.y;
        currCount = Memory.posList[frommRoomName][newX][newY].count * 1.2;
        
        if (currCount !== undefined && currCount > lastHighestCount) {
            newDir.x = newX; newDir.y = newY;
            lastHighestCount = currCount;
        }
        
        newX = fromX + oldDir.x
    },
    
    calcPaths: function() {
        // calc nodes first
    },
    
    calcNodes: function() {
        /*var posList = Memory.posList;
        var nodes = {};
        for(var roomName in posList) {
            for(var x in posList[roomName]) {
                for (var y in posList[roomName][x]) {
                    var biggest = {};
                    for(var xi = x - 1; xi <= x + 1; xi++) {
                        for(var yi = y - 1; yi <= y + 1; yi++) {
                            if(xi >= 0 && xi < 50 && yi >= 0 && yi < 50) {
    			                posObjArr = structure.room.lookAt(xi, yi);
    			                //console.log(JSON.stringify(posObjArr));
                    			posObj = posObjArr[0]; //posObjArray.length-1];
                    		}
                    		if( posObj && posObj['type'] == 'terrain' && !(posObj['terrain'] == 'wall') ) sourceList[i].freePos += 1;
                        }
                    }
                    
                }
            }
        }
        //get the pos list object
        //find the lowest count
        //find the highest count (is where they are just standing around)
        //calculate differences
        */
    },
    
    calcDests: function() {
        // get all nodes 
        // seperate standing points
        // standing points are dests
    }
};