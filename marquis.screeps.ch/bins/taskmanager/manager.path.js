/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('manager.path');
 * mod.thing == 'a thing'; // true
 */

module.exports = {
    logPathToPositions: function(path, roomName, target) {
        //for creep at pos 
        //path = [{"x":15,"y":23,"dx":-1,"dy":1,"direction":6},{"x":14,"y":23,"dx":-1,"dy":0,"direction":7},{"x":13,"y":23,"dx":-1,"dy":0,"direction":7},{"x":12,"y":24,"dx":-1,"dy":1,"direction":6},{"x":11,"y":25,"dx":-1,"dy":1,"direction":6},{"x":10,"y":26,"dx":-1,"dy":1,"direction":6},{"x":9,"y":27,"dx":-1,"dy":1,"direction":6},{"x":8,"y":28,"dx":-1,"dy":1,"direction":6},{"x":8,"y":29,"dx":0,"dy":1,"direction":5},{"x":9,"y":30,"dx":1,"dy":1,"direction":4},{"x":10,"y":31,"dx":1,"dy":1,"direction":4},{"x":11,"y":31,"dx":1,"dy":0,"direction":3},{"x":12,"y":32,"dx":1,"dy":1,"direction":4}]
        //{the pos you walk to, the dir you need to alk for this pos, direction is the constant for the direction -> move(6);
        
        //console.log(JSON.stringify(path));
        
        if(Memory.posList === undefined) 
			Memory.posList = {};
		if(Memory.posList[roomName] === undefined) 
			Memory.posList[roomName] = {};
			
        for (var i = 0; i < path.length; i++) {
            var entry = path[i];
            var lastX = entry.x + ( entry.dx * (-1) );
            var lastY = entry.y + ( entry.dy * (-1) );
        
            if(Memory.posList[roomName][lastX] === undefined) 
				Memory.posList[roomName][lastX] = {};
			if(Memory.posList[roomName][lastX][lastY] === undefined) 
				Memory.posList[roomName][lastX][lastY] = {};
			
			var toRoomName = target.pos.roomName; var toX = target.pos.x; var toY = target.pos.y;
			
			if(Memory.posList[roomName][lastX][lastY].dests === undefined)
				Memory.posList[roomName][lastX][lastY].dests = {};
			if(Memory.posList[roomName][lastX][lastY].dests[toRoomName] === undefined)
				Memory.posList[roomName][lastX][lastY].dests[toRoomName] = {};
			if(Memory.posList[roomName][lastX][lastY].dests[toRoomName][toX] === undefined)
				Memory.posList[roomName][lastX][lastY].dests[toRoomName][toX] = {};
			if(Memory.posList[roomName][lastX][lastY].dests[toRoomName][toX][toY] === undefined)
				Memory.posList[roomName][lastX][lastY].dests[toRoomName][toX][toY] = {};
			if(Memory.posList[roomName][lastX][lastY].dests[toRoomName][toX][toY].count === undefined)
				Memory.posList[roomName][lastX][lastY].dests[toRoomName][toX][toY].count = 0;
			
			Memory.posList[roomName][lastX][lastY].dests[toRoomName][toX][toY].count += 1;
			
			var dirX = entry.dx; var dirY = entry.dy;

            if(Memory.posList[roomName][lastX][lastY].dests[toRoomName][toX][toY].dirs === undefined)
				Memory.posList[roomName][lastX][lastY].dests[toRoomName][toX][toY].dirs = {};
			if(Memory.posList[roomName][lastX][lastY].dests[toRoomName][toX][toY].dirs[dirX] === undefined)
    			Memory.posList[roomName][lastX][lastY].dests[toRoomName][toX][toY].dirs[dirX] = {};
			if(Memory.posList[roomName][lastX][lastY].dests[toRoomName][toX][toY].dirs[dirX][dirY] === undefined)
    			Memory.posList[roomName][lastX][lastY].dests[toRoomName][toX][toY].dirs[dirX][dirY] = {};
    			
			
			if(Memory.posList[roomName][lastX][lastY].dests[toRoomName][toX][toY].dirs[dirX][dirY].count === undefined)
				Memory.posList[roomName][lastX][lastY].dests[toRoomName][toX][toY].dirs[dirX][dirY].count = 0;
			
			Memory.posList[roomName][lastX][lastY].dests[toRoomName][toX][toY].dirs[dirX][dirY].count += 1;
        }
    },
    
    logPosition: function(creep) {
        
    },
    
    getBestNextDir: function(lastX, lastY, fromRoomName, fromX, fromY, toRoomName, toX, toY) {
        //return undefined;

        if(fromRoomName !== toRoomName) {
            return undefined;
        }
        
        //Memory.allNewPos = allNewPos;
		//console.log(JSON.stringify(Memory.allNewPos).concat(JSON.stringify(backPosX, ",", backPosY)));
        var nextX; var nextY;
		
		if( Memory.posList !== undefined
				&& Memory.posList[fromRoomName] !== undefined
				&& Memory.posList[fromRoomName][fromX] !== undefined
				&& Memory.posList[fromRoomName][fromX][fromY] !== undefined
				&& Memory.posList[fromRoomName][fromX][fromY].dests !== undefined
				&& Memory.posList[fromRoomName][fromX][fromY].dests[toRoomName] !== undefined
				&& Memory.posList[fromRoomName][fromX][fromY].dests[toRoomName][toX] !== undefined
				&& Memory.posList[fromRoomName][fromX][fromY].dests[toRoomName][toX][toY] !== undefined
				&& Memory.posList[fromRoomName][fromX][fromY].dests[toRoomName][toX][toY].count !== undefined			
				&& Memory.posList[fromRoomName][fromX][fromY].dests[toRoomName][toX][toY].dirs !== undefined) {
			
			var lastCount = -1;
			
			var dirList = Memory.posList[fromRoomName][fromX][fromY].dests[toRoomName][toX][toY].dirs;
			
			for (var dirX in dirList) { //should be max of 3 for either -1 / 0 / 1
				var dirObjX = dirList[dirX];
				dirX = parseInt(dirX);
				for(var dirY in dirObjX) { //should be max of 3 for either -1 / 0 / 1
					
					var dirObjY = dirObjX[dirY];
					dirY = parseInt(dirY);
					if(dirX !== lastX - fromX || dirY !== lastY - fromY) {
					    if (dirX >= -1 && dirX <= 1 && dirY >= -1 && dirY <= 1) {
						
    						if (dirObjY.count >= lastCount) { // 20 for learning phase
    							
    							var posObjArr; var posObj;
    							var posX = fromX + dirX; var posY = fromY + dirY;
    							if(posX >= 0 && posX < 50 && posY >= 0 && posY < 50) {
    								posObjArr = Game.rooms[fromRoomName].lookAt(posX, posY);
    								posObj = posObjArr[0];
    								
    
    								if( posObj['type'] == 'terrain' && !(posObj['terrain'] == 'wall') ) {
    								
    									lastCount = dirObjY.count;
    									nextX = dirX; nextY = dirY;
    								}
    							}
    						}
    					}
					}
				}
			}
		}
		
		if ( nextX !== undefined && nextY !== undefined )
			return { x: nextX, y: nextY, roomName: fromRoomName };
		else 
			return undefined;
    },
    
    getBestNextPos: function(lastX, lastY, fromRoomName, fromX, fromY, toRoomName, toX, toY) {
        var result = this.getBestNextDir(lastX, lastY, fromRoomName, fromX, fromY, toRoomName, toX, toY);
        
        if(result !== undefined) {
            result.x = fromX + result.x;
            result.y = fromY + result.y;
        }
        
        return result;
    },
    
    /*cleanUpPositions: function() {
        console.log(">> Cleaning up positions at time: ".concat(Game.time));
        for(var hereRoom in Memory.posList) { hereRoom = Memory.posList[hereRoom];
            for (var hereX in hereRoom) { hereX = hereRoom[hereX];
                for (var hereY in hereX) { hereY = hereX[hereY];
                    if (hereY.count - 1 >= 0) hereY.count -= 2;
                    
                    for (var destRoom in hereY.dests) { destRoom = hereY.dests[destRoom];
                        for (var destX in destRoom) { destX = destRoom[destX];
                            for (var destY in destX) { destY = destX[destY];
                                if (destY.count - 1 >= 0) destY.count -= 2;
                                
                                for (var dirRoom in destY.dirs) { dirRoom = destY.dirs[dirRoom];
                                    for (var dirX in dirRoom) { dirX = dirRoom[dirX];
                                        for (var dirY in dirX) { dirY = dirX[dirY];
                                            if (dirY.count - 1 >= 0) dirY.count -= 2;
        }   }   }   }   }   }   }   }   }
    }*/
};