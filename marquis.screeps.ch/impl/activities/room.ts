import creepFactory from '../creep/CreepFactory';
import utils from '../utils/utils';
import activityScheduler from '../activities/ActivityScheduler';

interface ICustomRoomMemory extends Object
{
    roomName: string;
    spawnName: string;
    stage; number;
}

const STAGES = [
    function (room: Room, memory: ICustomRoomMemory)
    {
        const spawn = Game.spawns[memory.spawnName];

        if (spawn.spawning)
            return 0;

        const newCreepName = creepFactory.generateName("worker", 1);

        if (creepFactory.worker(spawn, 1, newCreepName) !== OK)
            return 0;

        activityScheduler.push({ next: 'runWorker', memory: { creepName: newCreepName } });
        
        return 1;
    },
    function (room: Room, memory: ICustomRoomMemory)
    {
        const spawn = Game.spawns[memory.spawnName];

        if (spawn.spawning)
            return 0;

        const newCreepName = creepFactory.generateName("worker", 1);

        if (creepFactory.worker(spawn, 1, newCreepName) !== OK)
            return 0;

        activityScheduler.push({ next: 'createWorker', memory: { creepName: newCreepName } });

        return 1;
    },
    function (room: Room, memory: any)
    {
        // TODO: Draw roads between all buildings and resources and exits
        // Then align buildings in a circle around spawn

        return 1;
    },
    function (room: Room, memory: any)
    {
        return 0;
    }
];

export default function runRoom(memory: ICustomRoomMemory)
{
    const room = Game.rooms[memory.roomName];

    if (typeof memory.stage !== "number")
        memory.stage = 0;

    if (!memory.spawnName)
    {
        memory.spawnName = utils.getSpawnFromRoom(room.name);
    }

    if (STAGES[memory.stage])
        memory.stage += STAGES[memory.stage](room, memory);

    return "runRoom";
};