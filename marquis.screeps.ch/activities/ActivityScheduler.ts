import { memoize } from 'lodash';
import FUNCTIONS from '../constants/FUNCTIONS';
import functions from '../functions';
import ICustomMemory from '../ICustomMemory';
// import 'lodash/isArray';
// import _ = require('lodash');

// % Scheduler Functions
//   %kill
//   %suspend
// # Run same function (is not a sub-activity)
// > Create a sub activity
//   >gather(({ creepName: 'worker-L001-234' }))
// < Return (Currently values are ignored)

// [ { next: '', memory: { } }, { next: '', memory .... } ]

class ActivityScheduler
{
    mem: ICustomMemory;

    init()
    {
        const mem = this.mem = Memory as ICustomMemory;

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

                this.push({ next: FUNCTIONS.ROOM, memory: { roomName: roomName } });

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

    push(activity)
    {
        if (typeof activity.length !== 'number')
            activity = [activity];
        
        this.mem.nextActivities.push(activity);
    }

    schedule()
    {
        this.mem.activities.unshift.apply(this.mem.activities, this.mem.nextActivities);

        this.mem.nextActivities = [];
    }

    query(activityName: string, filter?: (Object) => boolean): Object[]
    {
        const activities = [];
        const filteredActivities = [];
        const mem = this.mem;

        activities.push.apply(activities, mem.activities);
        activities.push.apply(activities, mem.nextActivities);

        for (let k in activities)
        {
            let activity = activities[k];
            
            activity = activity[0];

            if (activity.next === activityName && (!filter || filter(activity.memory)))
                filteredActivities.push(activity.memory);
        }

        return filteredActivities;
    }

    run()
    {
        console.log(`---{ Tick ${Game.time} }--------------------`);

        const mem = this.mem;

        while (mem.activities.length > 0)
        {
            let activityStack = mem.activities.pop();

            if (activityStack)
            {
                // console.log("Next activity", activity);

                // console.log("Running activity: ", JSON.stringify(activity));

                let activity = activityStack[activityStack.length - 1];

                try
                {
                    // console.log(JSON.stringify(activityStack));
                    // For now function will share memory
                    let nextFunction = functions[activity.next](activityStack[0].memory);
                    var fnCode = nextFunction[0];
                    const hasFnCode = ['<', '>', '%', '#'].includes(fnCode);

                    // console.log(nextFunction);
                    
                    if (hasFnCode)
                    {
                        if (nextFunction.length <= 1)
                            nextFunction = activity.next;
                        else
                            nextFunction = nextFunction.substring(1);
                    }
                    else
                    {
                        fnCode = '#';
                    }

                    // console.log(nextFunction);

                    switch (fnCode)
                    {
                        case '>':
                            activityStack.push({ next: nextFunction });
                            break;
                        case '#':
                            activity.next = nextFunction;
                            break;
                        case '<':
                            activityStack.pop();
                            break;
                        // case '%':
                        //     const cmd = nextFunction;
                        //     if (cmd === 'kill')
                        //         continue; // TODO:
                        //     else if (cmd === 'suspend')
                        //         continue; // TODO:
                        //     break;
                        default:
                            // Old functions
                            activity.next = nextFunction;
                        break;
                    }
                }
                catch (e)
                {
                    console.log(e);
                    if (!activity.exceptions)
                        activity.exceptions = [];
                    activity.exceptions.push([`${(new Date()).toISOString()}: Activity ${activity.next} encountered an exception:`, e.name, `${e.lineNumber}:${e.columnNumber}`, e.message, e.stack]);
                    activity.suspend = true;
                }

                this.push(activityStack);

                // if (activity.suspend)
                //     mem.suspendedActivities.push(activityStack);
                // else if (activity.next !== 'kill')
                //     this.push(activityStack);
            }
        }
    }
}

const activityScheduler = new ActivityScheduler();

export default activityScheduler;