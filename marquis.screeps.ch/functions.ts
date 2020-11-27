import utils from './utils/utils';
import room from './activities/room';
import creepFactory from './creep/CreepFactory';
import STRUCTURE_BUILD_PRIORITIES from './constants/STRUCTURE_BUILD_PRIORITIES';
import FUNCTIONS from './constants/FUNCTIONS';

interface ICustomWorkerMemory extends Object
{
    creepName: string;
    sourcing: boolean;
    spawnName: string;
    taskIndex: number;
    structureId: Id<AnyStructure>;
}

export default {
    [FUNCTIONS.ROOM]: room,

    [FUNCTIONS.CREATE_CREEP]: function (memory: ICustomWorkerMemory)
    {
        const creep = Game.creeps[memory.creepName];

        if (creep)
            return FUNCTIONS.GATHER;

        if (!memory.spawnName)
            memory.spawnName = Object.keys(Game.spawns)[0];

        const spawn = Game.spawns[memory.spawnName];
        if (spawn.spawning)
            return FUNCTIONS.CREATE_CREEP;

        const creepLevel = creepFactory.getMaxLevel(spawn, 'worker');
        const newCreepName = creepFactory.generateName('worker', 1);

        const spawnCode = creepFactory.worker(spawn, creepLevel, newCreepName);
        if (spawnCode !== OK)
            return FUNCTIONS.CREATE_CREEP;

        memory.creepName = newCreepName;

        return FUNCTIONS.GATHER;
    },

    [FUNCTIONS.GATHER]: function (memory: ICustomWorkerMemory)
    {
        const creep = Game.creeps[memory.creepName];

        if (!creep)
            return FUNCTIONS.CREATE_CREEP;

        if (creep.spawning)
            return FUNCTIONS.GATHER;

        var sources = creep.room.find(FIND_SOURCES);

        let harvestCode = creep.harvest(sources[0]);

        if(harvestCode === ERR_NOT_IN_RANGE)
        {
            creep.moveTo(sources[0], { visualizePathStyle: { stroke: '#ffff44' }, reusePath: 15 });
            return FUNCTIONS.GATHER;
        }

        if (harvestCode === OK && creep.store.getFreeCapacity(RESOURCE_ENERGY) > 0)
            return FUNCTIONS.GATHER;

        // Decide what to do next
        const structureCountWithFreeCapacity = creep.room.find(FIND_STRUCTURES, { 
            filter: structure => (structure.structureType == STRUCTURE_EXTENSION ||
                        structure.structureType == STRUCTURE_SPAWN ||
                        structure.structureType == STRUCTURE_TOWER) &&
                        structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0
        }).length;

        if (structureCountWithFreeCapacity > 0)
            return FUNCTIONS.TRANSFER;

        if (creep.room.find(FIND_CONSTRUCTION_SITES).length > 0)
            return FUNCTIONS.BUILD;
        
        return FUNCTIONS.UPGRADE;
    },

    [FUNCTIONS.TRANSFER]: function (memory: ICustomWorkerMemory)
    {
        const creep = Game.creeps[memory.creepName];

        if (!creep)
            return FUNCTIONS.CREATE_CREEP;

        if (creep.store.getUsedCapacity(RESOURCE_ENERGY) === 0)
            return FUNCTIONS.GATHER;

        const transferTarget = creep.room.find(FIND_STRUCTURES, { 
            filter: structure => (structure.structureType == STRUCTURE_EXTENSION ||
                        structure.structureType == STRUCTURE_SPAWN ||
                        structure.structureType == STRUCTURE_TOWER) &&
                        structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0
        })[0];

        if (!transferTarget)
            return FUNCTIONS.BUILD;

        const transferCode = creep.transfer(transferTarget, RESOURCE_ENERGY);

        if (transferCode === ERR_NOT_IN_RANGE)
        {
            creep.moveTo(transferTarget, { visualizePathStyle: { stroke: '#ffff44' }, reusePath: 15 });

            return FUNCTIONS.TRANSFER;
        }

        if (creep.store.getUsedCapacity(RESOURCE_ENERGY) > 0)
            return FUNCTIONS.TRANSFER;

        return FUNCTIONS.GATHER;
    },

    [FUNCTIONS.UPGRADE]: function (memory: ICustomWorkerMemory)
    {
        const creep = Game.creeps[memory.creepName];

        if (!creep)
            return FUNCTIONS.CREATE_CREEP;

        if (creep.store.getUsedCapacity(RESOURCE_ENERGY) === 0)
            return FUNCTIONS.GATHER;

        const upgradeCode = creep.upgradeController(creep.room.controller);

        if (upgradeCode === ERR_NOT_IN_RANGE)
        {
            creep.moveTo(creep.room.controller, { visualizePathStyle: { stroke: '#44FF44' }, reusePath: 15 });

            return FUNCTIONS.UPGRADE;
        }

        if (upgradeCode === OK && creep.store.getUsedCapacity(RESOURCE_ENERGY) > 0)
            return FUNCTIONS.UPGRADE;

        return FUNCTIONS.GATHER;
    },

    [`${FUNCTIONS.CREATE_CREEP}2`]: function (memory: ICustomWorkerMemory)
    {
        const creep = Game.creeps[memory.creepName];

        if (creep)
            return '<';

        if (!memory.spawnName)
            memory.spawnName = Object.keys(Game.spawns)[0];

        const spawn = Game.spawns[memory.spawnName];
        if (spawn.spawning)
            return '#';

        const creepLevel = creepFactory.getMaxLevel(spawn, 'worker');
        const newCreepName = creepFactory.generateName('worker', creepLevel);

        const spawnCode = creepFactory.worker(spawn, creepLevel, newCreepName);
        if (spawnCode !== OK)
            return '#';

        memory.creepName = newCreepName;

        return '<';
    },

    [`${FUNCTIONS.GATHER}2`]: function (memory: ICustomWorkerMemory)
    {
        const creep = Game.creeps[memory.creepName];

        if (!creep)
            return '<';

        if (creep.spawning)
            return '#';

        var sources = creep.room.find(FIND_SOURCES);

        let harvestCode = creep.harvest(sources[0]);

        if(harvestCode === ERR_NOT_IN_RANGE)
        {
            creep.moveTo(sources[0], { visualizePathStyle: { stroke: '#ffff44' }, reusePath: 15 });
            return `#`;
        }

        if (harvestCode === OK && creep.store.getFreeCapacity(RESOURCE_ENERGY) > 0)
            return `#`;

        return '<';
    },

    [FUNCTIONS.REPAIR]: function (memory: ICustomWorkerMemory)
    {
        // console.log("repair you sucker!!!!!", JSON.stringify(memory));

        const creep = Game.creeps[memory.creepName];

        if (!creep)
            return `>${FUNCTIONS.CREATE_CREEP}2`;

        // Keep claiming creep so this activity can run next tick.
        (creep.memory as any).claim = Game.time;

        if (creep.store.getUsedCapacity(RESOURCE_ENERGY) === 0)
            return `>${FUNCTIONS.GATHER}2`;

        let repairTarget = Game.getObjectById(memory.structureId);

        if (!repairTarget || repairTarget.hits > repairTarget.hitsMax - 100)
        {
            repairTarget = creep.room.find(FIND_STRUCTURES, { 
                filter: structure => structure.hits !== structure.hitsMax
            }).sort((a, b) => (a.hits / a.hitsMax) - (b.hits / b.hitsMax))[0];
            memory.structureId = repairTarget.id;
        }
        
        const repairCode = creep.repair(repairTarget);

        if (repairCode === ERR_NOT_IN_RANGE)
        {
            creep.moveTo(repairTarget);
            return '#';
        }

        if (repairCode === OK && repairTarget.hits < repairTarget.hitsMax)
            return '#';

        return '#';
    },

    [FUNCTIONS.BUILD]: function(memory: ICustomWorkerMemory)
    {
        const creep = Game.creeps[memory.creepName];

        if (!creep)
            return FUNCTIONS.CREATE_CREEP;

        if (creep.store.getUsedCapacity(RESOURCE_ENERGY) === 0)
            return FUNCTIONS.GATHER;

        var target = creep.room.find(FIND_CONSTRUCTION_SITES)
            .sort((constructionSiteA, constructionSiteB) => 
                STRUCTURE_BUILD_PRIORITIES[constructionSiteA.structureType] - STRUCTURE_BUILD_PRIORITIES[constructionSiteB.structureType])[0];

        if(!target)
            return FUNCTIONS.GATHER;

        const buildCode = creep.build(target);

        if (buildCode === ERR_NOT_IN_RANGE)
        {
            creep.moveTo(target, { visualizePathStyle: { stroke: '#22FF22' }, reusePath: 15 });
            return FUNCTIONS.BUILD;
        }

        if (buildCode === OK && creep.store.getUsedCapacity(RESOURCE_ENERGY) > 0)
            return FUNCTIONS.BUILD;

        return FUNCTIONS.GATHER;
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