export default {
    harvestEnergy: function (creep: Creep)
    {
        var sources = creep.room.find(FIND_SOURCES);
        if (creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) 
            creep.moveTo(sources[0]);
    },
    transferEnergy: function (creep: Creep, structure: AnyStructure)
    {
        if (creep.transfer(structure, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) 
            creep.moveTo(structure);
    },
    getSpawnFromRoom: function (roomName: string)
    {
        for (let spawnName in Game.spawns)
        {
            const spawn = Game.spawns[spawnName];
            if (spawn.room.name === roomName)
                return spawnName;
        }

        return null;
    }
}