var manager_task = require('manager.task');
var role_creep = require('role.creep');
var role_tower = require('role.tower');

var taskCreationCycle = 15;

module.exports.loop = function () {
    
    manager_task.registerTick();
	if(Game.time % taskCreationCycle === 0) { manager_task.run(); }
    
    
    for(var creepName in Game.creeps) {
        var creep = Game.creeps[creepName];
        
        if(!creep.spawning) {
            role_creep.run(creep);
        }
    }
    
    role_tower.run(Game.getObjectById('58a68d4d5ef060f3422d875e'));
}