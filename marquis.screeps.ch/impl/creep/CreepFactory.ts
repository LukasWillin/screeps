import ICustomMemory from '../ICustomMemory';

const mem = Memory as ICustomMemory;

const CREEP_BODY_LOOKUP = {
    worker: [
        [WORK, CARRY, MOVE]
    ]
};

export default {
    generateName: function(type: string, level: number)
    {
        const creepIndex = mem.creepIndex;

        if (typeof creepIndex !== "number")
            mem.creepIndex = 0;

        return `${type}-L${("" + level).padStart(3, "0")}-${mem.creepIndex++}`;
    },
    worker: function (spawn: StructureSpawn, level: number, name: string)
    {
        return spawn.spawnCreep(CREEP_BODY_LOOKUP.worker[level - 1], name);
    }
};