import creepFactory from '../creep/CreepFactory';
import utils from '../utils/utils';
import activityScheduler from './ActivityScheduler';
import FUNCTIONS from '../constants/FUNCTIONS';

interface ICustomRoomMemory extends Object
{
    roomName: string;
    spawnName: string;
    stage; number;
    iter: number;
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

        activityScheduler.push({ next: FUNCTIONS.GATHER, memory: { creepName: newCreepName } });
        
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

const functionsRoom = {
    ROOM_CHECK_REPAIR: function (memory: ICustomRoomMemory)
    {
        const room = Game.rooms[memory.roomName];

        const repairTargets = room.find(FIND_STRUCTURES, { 
            filter: structure => (structure.hits / structure.hitsMax) < .6
        });

        const currentRepairActivities = activityScheduler.query(FUNCTIONS.REPAIR);

        for (let k in repairTargets)
        {
            const repairTarget = repairTargets[k];

            // if (currentRepairActivities.findIndex((a: any) => a.repairTargetId === repairTarget.id) < 0)
            //     activityScheduler.push({ next: FUNCTIONS.REPAIR, memory: { repairTargetId: repairTarget.id } });
        }

        return 'kill';
    } 
};

export default function room(memory: ICustomRoomMemory)
{
    const room = Game.rooms[memory.roomName];

    if (memory.iter < 0)
        memory.iter = 0;

    // if (typeof memory.stage !== "number")
    //     memory.stage = 0;

    if (!memory.spawnName)
        memory.spawnName = utils.getSpawnFromRoom(room.name);

    // if (STAGES[memory.stage])
    //     memory.stage += STAGES[memory.stage](room, memory);

    if (memory.iter % 15 === 0)
    {
        const currentRepairActivities = activityScheduler.query(FUNCTIONS.REPAIR);
        if (currentRepairActivities.length === 0)
            activityScheduler.push({ next: FUNCTIONS.REPAIR, memory: { } });
    }

    memory.iter++;

    return FUNCTIONS.ROOM;
};