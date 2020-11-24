import functions from '../functions';
import ICustomMemory from '../ICustomMemory';

class ActivityScheduler
{
    init()
    {
        const mem = Memory as ICustomMemory;

        if (!mem.activities)
            mem.activities = [];

        if (!mem.nextActivities)
            mem.nextActivities = [];

        if (!mem.initializedRooms)
            mem.initializedRooms = [];

        if (!mem.suspendedActivities)
            mem.suspendedActivities = [];

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

        for(var i in Memory.creeps)
        {
            if(!Game.creeps[i])
            {
                delete Memory.creeps[i];
            }
        }

        this.schedule();
    }

    push(state)
    {
        const mem = Memory as ICustomMemory;

        mem.nextActivities.push(state);
    }

    schedule()
    {
        const mem = Memory as ICustomMemory;

        mem.activities.unshift.apply(mem.activities, mem.nextActivities);

        mem.nextActivities = [];
    }

    run()
    {
        console.log(`---{ Tick ${Game.time} }--------------------`);
        const mem = Memory as ICustomMemory;

        while (mem.activities.length > 0)
        {
            const state = mem.activities.pop();

            if (state)
            {
                // console.log("Next state", state);

                // console.log("Running activity: ", JSON.stringify(state));

                try
                {
                    var nextFunction = functions[state.next](state.memory); // can return flags like 'kill'
                    state.next = nextFunction;
                }
                catch (e)
                {
                    console.error(e);
                    if (!state.exceptions)
                        state.exceptions = [];
                    state.exceptions.push([`${(new Date()).toISOString()}: Activity ${state.next} encountered an exception:`, e.name, `${e.lineNumber}:${e.columnNumber}`, e.message, e.stack]);
                    state.suspend = true;
                }

                if (state.suspend)
                    mem.suspendedActivities.push(state);
                else if (state.next !== 'kill')
                    this.push(state);
            }
        }
    }
}

const activityScheduler = new ActivityScheduler();

export default activityScheduler;