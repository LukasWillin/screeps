import utils from './utils/utils';
import room from './activities/room';
import creepFactory from './creep/CreepFactory';

interface ICustomWorkerMemory extends Object
{
    creepName: string;
    sourcing: boolean;
    spawnName: string;
    taskIndex: number;
}

export default {
    runRoom: room,

    runWorkerCreateCreep: function (memory: ICustomWorkerMemory)
    {
        if (!memory.spawnName)
            memory.spawnName = Object.keys(Game.spawns)[0];

        const spawn = Game.spawns[memory.spawnName];
        if (spawn.spawning)
            return 'runWorkerCreateCreep';

        const newCreepName = creepFactory.generateName("worker", 1);

        if (creepFactory.worker(spawn, 1, newCreepName) !== OK)
            return 'runWorkerCreateCreep';

        memory.creepName = newCreepName;

        return 'runWorkerSourcing';
    },

    createWorker: function (memory: ICustomWorkerMemory)
    {
        const creep = Game.creeps[memory.creepName];

        if (!creep)
            return 'runWorkerCreateCreep';

        return 'runWorkerSourcing';
    },

    runWorkerSourcing: function (memory: ICustomWorkerMemory)
    {
        const creep = Game.creeps[memory.creepName];

        if (!creep)
            return 'runWorkerCreateCreep';

        if(!memory.sourcing && creep.store[RESOURCE_ENERGY] == 0)
        {
            memory.sourcing = true;
            creep.say('Get Energy');
        }

        var sources = creep.room.find(FIND_SOURCES);

        let harvestCode = creep.harvest(sources[0]);

        if(harvestCode === ERR_NOT_IN_RANGE)
        {
            creep.moveTo(sources[0], { visualizePathStyle: { stroke: '#ffaa00' } });

            return 'runWorkerSourcing';
        }

        if (harvestCode === OK && creep.store.getFreeCapacity(RESOURCE_ENERGY) > 0)
        {
            return 'runWorkerSourcing';
        }

        if (memory.taskIndex === 0)
        {
            return 'runWorkerTransferEnergy';
        }
        else
        {
            return 'runWorkerUpgrading';
        }
    },

    runWorkerTransferEnergy: function (memory: ICustomWorkerMemory)
    {
        const creep = Game.creeps[memory.creepName];

        if (!creep)
            return 'runWorkerCreateCreep';

        const transferTarget = creep.room.find(FIND_STRUCTURES, { 
            filter: structure => (structure.structureType == STRUCTURE_EXTENSION ||
                        structure.structureType == STRUCTURE_SPAWN ||
                        structure.structureType == STRUCTURE_TOWER) &&
                        structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0
        })[0];

        if (!transferTarget)
        {
            return 'runWorkerUpgrading';
        }

        const transferCode = creep.transfer(transferTarget, RESOURCE_ENERGY);

        if (transferCode === ERR_NOT_IN_RANGE)
        {
            creep.moveTo(creep.room.controller, { visualizePathStyle: { stroke: '#ffffff' } });

            return 'runWorkerTransferEnergy';
        }

        return 'runWorkerSourcing';
    },

    runWorkerUpgrading: function (memory: ICustomWorkerMemory)
    {
        const creep = Game.creeps[memory.creepName];

        if (!creep)
            return 'runWorkerCreateCreep';

        const upgradeCode = creep.upgradeController(creep.room.controller);

        if (upgradeCode === ERR_NOT_IN_RANGE)
        {
            creep.moveTo(creep.room.controller, { visualizePathStyle: { stroke: '#ffffff' } });

            return 'runWorkerUpgrading';
        }

        if (upgradeCode === OK && creep.store.getCapacity(RESOURCE_ENERGY) > 0)
        {
            return 'runWorkerUpgrading';
        }

        return 'runWorkerSourcing';
    },

    runWorkerRepairing: function (memory: ICustomWorkerMemory)
    {
        // Find damaged buildings

        // Repair until no more energy

        return 'runWorkerSourcing';
    },

    runWorkerBuilding: function(memory: ICustomWorkerMemory)
    {
        // TODO find construction sites

        // Build until no energy

        return 'runWorkerSourcing';
    }

    // /** @param {Creep} creep **/
    // runBuilder: function(creep) {

	//     if(creep.memory.building && creep.store[RESOURCE_ENERGY] == 0) {
    //         creep.memory.building = false;
    //         creep.say('🔄 harvest');
	//     }
	//     if(!creep.memory.building && creep.store.getFreeCapacity() == 0) {
	//         creep.memory.building = true;
	//         creep.say('🚧 build');
	//     }

	//     if(creep.memory.building) {
	//         var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
    //         if(targets.length) {
    //             if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
    //                 creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#F00'}});
    //             }
    //         }
    //         else
    //         {
    //             var targets = creep.room.find(FIND_STRUCTURES, {
    //                 filter: (structure) => {
    //                     return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) &&
    //                         structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
    //                 }
    //             });
    //             if(targets.length > 0) {
    //                 if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
    //                     creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#F00'}});
    //                 }
    //             }
    //         }
            
	//     }
	//     else {
	//         if (creep.withdraw())
	//         var sources = creep.room.find(FIND_SOURCES);
    //         if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
    //             creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#F00'}});
    //         }
	//     }
    // },

    // runTower: function(tower: StructureTower, scope: any)
    // {
    //     var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
    //         filter: (structure) => structure.hits < structure.hitsMax
    //     });
    //     if(closestDamagedStructure) {
    //         tower.repair(closestDamagedStructure);
    //     }

    //     var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
    //     if(closestHostile) {
    //         tower.attack(closestHostile);
    //     }
    // }
}