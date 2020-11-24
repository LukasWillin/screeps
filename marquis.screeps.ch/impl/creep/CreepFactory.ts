import ICustomMemory from '../ICustomMemory';

function calculateBodyCost(bodyParts: string[])
{
    let totalCost = 0;
    for (let i in bodyParts)
    {
        totalCost += BODYPART_COST[bodyParts[i]];
    }
    return totalCost;
}

function getMaxCreepLevel(type: string, capacity: number)
{
    let bodyConfigs = CREEP_BODY_LOOKUP[type];

    for (let i = bodyConfigs.length - 1; i >= 0; i--)
    {
        const cost = calculateBodyCost(bodyConfigs[i]);
        if (cost < capacity)
            return i;
    }

    return 0;
}

const CREEP_BODY_LOOKUP = {
    worker: [
        [WORK, CARRY, MOVE],
        [WORK, CARRY, MOVE, MOVE],
        [WORK, WORK, CARRY, MOVE, MOVE],
        [WORK, WORK, CARRY, CARRY, MOVE, MOVE],
        [WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE],
    ]
};

export default {
    getMaxLevel: function (spawn: StructureSpawn, type: string) {
        const roomEnergyCapacity = spawn.room.energyCapacityAvailable;

        return getMaxCreepLevel(type, roomEnergyCapacity)
    },
    generateName: function(type: string, level: number)
    {
        const mem = Memory as ICustomMemory;

        const creepIndex = mem.creepIndex;

        if (typeof creepIndex !== "number")
            mem.creepIndex = 0;

        return `${type}-L${("" + level).padStart(3, "0")}-${mem.creepIndex++}`;
    },
    worker: function (spawn: StructureSpawn, level: number, name: string)
    {
        return spawn.spawnCreep(CREEP_BODY_LOOKUP['worker'][level], name);
    }
};