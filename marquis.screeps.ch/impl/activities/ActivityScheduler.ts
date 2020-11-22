import functions from '../functions';
import ICustomMemory from '../ICustomMemory';

const mem = Memory as ICustomMemory;

class ActivityScheduler
{
    init()
    {
        if (!mem.activities)
            mem.activities = [];

        if (!mem.nextActivities)
            mem.nextActivities = [];

        if (!mem.initializedRooms)
            mem.initializedRooms = [];

        for (let roomName in Game.rooms)
        {
            const room = Game.rooms[roomName];

            // room.controller?.owner.username === 'MarquisBS';
            
            // console.log("room init index", mem.initializedRooms.findIndex(rn => rn === roomName))

            if (mem.initializedRooms.findIndex(rn => rn === roomName) < 0)
            {
                // console.log("Room:", room, ", Controller.Owner", room.controller?.owner);

                this.push({ next: "runRoom", memory: { roomName: roomName } });

                mem.initializedRooms.push(roomName);
            }
        }

        this.schedule();
    }

    push(state)
    {
        mem.nextActivities.push(state);
    }

    schedule()
    {
        mem.activities.unshift.apply(mem.activities, mem.nextActivities);

        mem.nextActivities = [];
    }

    run()
    {
        while (mem.activities.length > 0)
        {
            const state = mem.activities.pop();

            if (state)
            {
                // console.log("Next state", state);

                state.next = functions[state.next](state.memory); // can return flags like 'kill'
        
                if (state.next !== 'kill')
                    this.push(state);
            }
        }
    }
}

const activityScheduler = new ActivityScheduler();

export default activityScheduler;