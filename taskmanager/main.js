//var role_harvester = require('role.harvester');
//var role_upgrader = require('role.upgrader');
//var role_builder = require('role.builder');

var manager_task = require('manager.task');
var role_creep = require('role.creep');
var manager_path = require('manager.path');
var taskCreationCycle = 15;

module.exports.loop = function () {
    
    manager_task.registerTick(); if(Game.time % taskCreationCycle === 0) { manager_task.run(); }
    
    manager_path.logPositions();
    //Game.creeps['Worker1'].memory['task'] = 'taskHarvest_1263';
    //console.log(Game.creeps['Worker1'].memory);
    
    for(var creepName in Game.creeps) {
        var creep = Game.creeps[creepName];
        
        if(!creep.spawning) {
            role_creep.run(creep);
        }
    }
    
}
    
    
    
    
    

    
    /*var tower = Game.getObjectById('26e1b3b35b6ed435628b133a');
    if(tower) {
        var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => structure.hits < structure.hitsMax
        });
        if(closestDamagedStructure) {
            tower.repair(closestDamagedStructure);
        }

        var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if(closestHostile) {
            tower.attack(closestHostile);
        }
    }*/

    /*for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if(creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        if(creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
        if(creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
    }*/