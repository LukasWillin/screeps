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
        const creep = Game.creeps[memory.creepName];

        if (creep)
            return 'runWorkerSourcing';

        if (!memory.spawnName)
            memory.spawnName = Object.keys(Game.spawns)[0];

        const spawn = Game.spawns[memory.spawnName];
        if (spawn.spawning)
            return 'runWorkerCreateCreep';

        const creepLevel = creepFactory.getMaxLevel(spawn, 'worker');
        const newCreepName = creepFactory.generateName('worker', 1);

        const spawnCode = creepFactory.worker(spawn, creepLevel, newCreepName);
        if (spawnCode !== OK)
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

        if (creep.spawning)
            return 'runWorkerSourcing';

        var sources = creep.room.find(FIND_SOURCES);

        let harvestCode = creep.harvest(sources[0]);

        if(harvestCode === ERR_NOT_IN_RANGE)
        {
            creep.moveTo(sources[0], { visualizePathStyle: { stroke: '#ffff44' }, reusePath: 15 });
            return 'runWorkerSourcing';
        }

        if (harvestCode === OK && creep.store.getFreeCapacity(RESOURCE_ENERGY) > 0)
            return 'runWorkerSourcing';

        if (memory.taskIndex === 0)
        {
            memory.taskIndex = 1;

            const structureCountWithFreeCapacity = creep.room.find(FIND_STRUCTURES, { 
                filter: structure => (structure.structureType == STRUCTURE_EXTENSION ||
                            structure.structureType == STRUCTURE_SPAWN ||
                            structure.structureType == STRUCTURE_TOWER) &&
                            structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0
            }).length;

            if (structureCountWithFreeCapacity > 0)
                return 'runWorkerTransferEnergy';

            if (creep.room.find(FIND_CONSTRUCTION_SITES).length > 0)
                return 'runWorkerBuilding';
        }

        memory.taskIndex = 0;
        
        return 'runWorkerUpgrading';
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
            creep.moveTo(transferTarget, { visualizePathStyle: { stroke: '#ffff44' }, reusePath: 15 });

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
            creep.moveTo(creep.room.controller, { visualizePathStyle: { stroke: '#44FF44' }, reusePath: 15 });

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
        const creep = Game.creeps[memory.creepName];

        if (!creep)
            return 'runWorkerCreateCreep';

        var target = creep.room.find(FIND_CONSTRUCTION_SITES)[0];

        if(!target)
            return 'runWorkerSourcing';

        const buildCode = creep.build(target);

        if (buildCode === ERR_NOT_IN_RANGE)
        {
            creep.moveTo(target, { visualizePathStyle: { stroke: '#22FF22' }, reusePath: 15 });
            return 'runWorkerBuilding';
        }

        if (buildCode === OK && creep.store.getCapacity(RESOURCE_ENERGY) > 0)
            return 'runWorkerBuilding';

        return 'runWorkerSourcing';
    }

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