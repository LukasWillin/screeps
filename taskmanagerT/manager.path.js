/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('manager.path');
 * mod.thing == 'a thing'; // true
 */

module.exports = {
    
    logPositions: function() {
        for(var creepName in Game.creeps) {
            var creep = Game.creeps[creepName];
            this.logPosition(creep, creep.pos.x, creep.pos.y);
        }
    },
    
    logPosition: function(creep, x, y) {
        var roomName = creep.room.name;
        
        if(Memory.posList === undefined) Memory.posList = {};
        if(Memory.posList[roomName] === undefined) Memory.posList[roomName] = {};
        if(Memory.posList[roomName][x] === undefined) Memory.posList[roomName][x] = {};
        if(Memory.posList[roomName][x][y] === undefined) Memory.posList[roomName][x][y] = {};
        if(Memory.posList[roomName][x][y].count === undefined) Memory.posList[roomName][x][y].count = 0;
        
        Memory.posList[roomName][x][y].count = Memory.posList[roomName][x][y].count + 1;
        var dest;
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
    
    getBestNextStep: function(lastX, lastY, fromRoomName, fromX, fromY, toRoomName, toX, toY) {
        return undefined;
        
        if(fromRoomName !== toRoomName) {
            return undefined;
        }
        
        // oldDir is startingPoint
        // then you go the opposite
        // from here take the rest of directions
        var oldDir = {};
        oldDir.x = (lastX - fromX);
        oldDir.y = (lastY - fromY);
        
        //console.log("last(".concat( lastX, "," , lastY, ") - now(", fromX, ",", fromY, ")"));
        //console.log(JSON.stringify(oldDir));
        
        // for forward go opposite direction
        // for sides -> switch x&y and do * (-1,1) and once (1,-1)
        var forwPos = {};
        forwPos.x = fromX - oldDir.x;
        forwPos.y = fromY - oldDir.y;
        
        var backPos = {};
        backPos.x = lastX;
        backPos.y = lastY;
        
        var side1Pos = {};
        side1Pos.x = fromX + oldDir.y * (+1);
        side1Pos.y = fromY + oldDir.x * (-1);
        
        var side2Pos = {};
        side2Pos.x = fromX + oldDir.y * (-1);
        side2Pos.y = fromY + oldDir.x * (+1);
        
        // *** These next steps are directions instead of positions ***
        // for diags add (xi,yi) next to each other and reduce every value bigger then 1 to 1
        var forwDiag1Dir = {};
        forwDiag1Dir.x = Math.floor( ((forwPos.x + 0.5 - side1Pos.x) / 2) );
        forwDiag1Dir.y = Math.floor( ((forwPos.y + 0.5 - side1Pos.y) / 2) );
        
        var forwDiag2Dir = {};
        forwDiag2Dir.x = Math.floor( ((forwPos.x + 0.5 - side2Pos.x) / 2) );
        forwDiag2Dir.y = Math.floor( ((forwPos.y + 0.5 - side2Pos.y) / 2) );
        
        var backDiag1Dir = {};
        backDiag1Dir.x = Math.floor( ((backPos.x + 0.5 - side1Pos.x) / 2) );
        backDiag1Dir.y = Math.floor( ((backPos.y + 0.5 - side1Pos.y) / 2) );
        
        var backDiag2Dir = {};
        backDiag2Dir.x = Math.floor( ((backPos.x + 0.5 - side2Pos.x) / 2) );
        backDiag2Dir.y = Math.floor( ((backPos.y + 0.5 - side2Pos.y) / 2) );
        
        // calc digPos by adding all dirs to the from x & y coords
        var forwDiag1Pos = {};
        forwDiag1Pos.x = fromX + forwDiag1Dir.x;
        forwDiag1Pos.y = fromX + forwDiag1Dir.y;
        
        var forwDiag2Pos = {};
        forwDiag2Pos.x = fromX + forwDiag2Dir.x;
        forwDiag2Pos.y = fromX + forwDiag2Dir.y;
        
        var backDiag1Pos = {};
        backDiag1Pos.x = fromX + backDiag1Dir.x;
        backDiag1Pos.y = fromX + backDiag1Dir.y;
        
        var backDiag2Pos = {};
        backDiag2Pos.x = fromX + backDiag2Dir.x;
        backDiag2Pos.y = fromX + backDiag2Dir.y;
        
        
        var allNewPos = {}
        allNewPos.forwPos = forwPos;
        allNewPos.forwDiag1Pos = forwDiag1Pos;
        allNewPos.forwDiag2Pos = forwDiag2Pos;
        allNewPos.side1Pos = side1Pos;
        allNewPos.side2Pos = side2Pos;
        allNewPos.backDiag1Pos = backDiag1Pos;
        allNewPos.backDiag2Pos = backDiag2Pos;
        
        var lastHighestCount = -1; var currCount = lastHighestCount;
        var newX = -1; newY = -1;
        var factorStep = 1;
        var factor = 1.2;
        
        Memory.allNewPos = allNewPos;
        console.log(JSON.stringify(Memory.allNewPos).concat(JSON.stringify(backPos)));
        
        //TODO check for destination
        for (var key in allNewPos) {
            
            if ( Memory.posList[fromRoomName] !== undefined &&
    		            Memory.posList[fromRoomName][ allNewPos[key].x ] !== undefined &&
    		            Memory.posList[fromRoomName][ allNewPos[key].x ][ allNewPos[key].y ] !== undefined) {
    		                
                currCount = Memory.posList[fromRoomName][ allNewPos[key].x ][ allNewPos[key].y ].count * factor;
                
                factorStep = (++factorStep) % 2;    if(factorStep === 0) factor -= 0.1;
                
                
                //console.log(!Memory.posList[fromRoomName][ allNewPos[key].x ][ allNewPos[key].y ].dests[toRoomName][toX][toY]);
                //if(Memory.posList[fromRoomName][ allNewPos[key].x ][ allNewPos[key].y ].dests[toRoomName][toX][toY] === undefined) {
                //    console.log("No entry for ".concat("(" , toX , "," , toY , ") at (", allNewPos[key].x , "," , allNewPos[key].y, ")")); //Memory.posList[fromRoomName][ allNewPos[key].x ][ allNewPos[key].y ].dests[toRoomName][toX]);
                //}
                if (    Memory.posList[fromRoomName][ allNewPos[key].x ][ allNewPos[key].y ].dests[toRoomName] !== undefined &&
    		            Memory.posList[fromRoomName][ allNewPos[key].x ][ allNewPos[key].y ].dests[toRoomName][toX] !== undefined &&
    		            Memory.posList[fromRoomName][ allNewPos[key].x ][ allNewPos[key].y ].dests[toRoomName][toX][toY] !== undefined) {
        		    
        		    var posObjArr; var posObj;    
	                if(allNewPos[key].x >= 0 && allNewPos[key].x < 50 && allNewPos[key].y >= 0 && allNewPos[key].y < 50) {
                        posObjArr = Game.rooms[fromRoomName].lookAt(allNewPos[key].x, allNewPos[key].y);
            			posObj = posObjArr[0];
            		}
            		if( posObj && posObj['type'] == 'terrain' && !(posObj['terrain'] == 'wall') ) {
            		    
            		    if(currCount > lastHighestCount) {
                            lastHighestCount = currCount;
                            
                            newX = allNewPos[key].x; newY = allNewPos[key].y;
                        }
            		}
	            }
            }
        }
        if (newX !== -1 && newY !== -1) {
            //console.log("new coords".concat(newX, ",", newY));
            return { x: newX, y: newY, roomName: fromRoomName};
        } else {
            
        }
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