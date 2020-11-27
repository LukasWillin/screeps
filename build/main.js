module.exports.loop =
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./marquis.screeps.ch/activities/ActivityScheduler.ts":
/*!************************************************************!*\
  !*** ./marquis.screeps.ch/activities/ActivityScheduler.ts ***!
  \************************************************************/
/*! flagged exports */
/*! export __esModule [provided] [no usage info] [missing usage info prevents renaming] */
/*! export default [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_exports__, __webpack_require__ */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const FUNCTIONS_1 = __webpack_require__(/*! ../constants/FUNCTIONS */ "./marquis.screeps.ch/constants/FUNCTIONS.ts");
const functions_1 = __webpack_require__(/*! ../functions */ "./marquis.screeps.ch/functions.ts");
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
class ActivityScheduler {
    init() {
        const mem = this.mem = Memory;
        if (!mem.activities)
            mem.activities = [];
        if (!mem.nextActivities)
            mem.nextActivities = [];
        if (!mem.initializedRooms)
            mem.initializedRooms = [];
        if (!mem.suspendedActivities)
            mem.suspendedActivities = [];
        for (let roomName in Game.rooms) {
            const room = Game.rooms[roomName];
            // room.controller?.owner.username === 'MarquisBS';
            // console.log("room init index", mem.initializedRooms.findIndex(rn => rn === roomName))
            if (mem.initializedRooms.findIndex(rn => rn === roomName) < 0) {
                // console.log("Room:", room, ", Controller.Owner", room.controller?.owner);
                this.push({ next: FUNCTIONS_1.default.ROOM, memory: { roomName: roomName } });
                mem.initializedRooms.push(roomName);
            }
        }
        for (var i in Memory.creeps) {
            if (!Game.creeps[i]) {
                delete Memory.creeps[i];
            }
        }
        this.schedule();
    }
    push(activity) {
        if (typeof activity.length !== 'number')
            activity = [activity];
        this.mem.nextActivities.push(activity);
    }
    schedule() {
        this.mem.activities.unshift.apply(this.mem.activities, this.mem.nextActivities);
        this.mem.nextActivities = [];
    }
    query(activityName, filter) {
        const activities = [];
        const filteredActivities = [];
        const mem = this.mem;
        activities.push.apply(activities, mem.activities);
        activities.push.apply(activities, mem.nextActivities);
        for (let k in activities) {
            let activity = activities[k];
            activity = activity[0];
            if (activity.next === activityName && (!filter || filter(activity.memory)))
                filteredActivities.push(activity.memory);
        }
        return filteredActivities;
    }
    run() {
        console.log(`---{ Tick ${Game.time} }--------------------`);
        const mem = this.mem;
        while (mem.activities.length > 0) {
            let activityStack = mem.activities.pop();
            if (activityStack) {
                // console.log("Next activity", activity);
                // console.log("Running activity: ", JSON.stringify(activity));
                let activity = activityStack[activityStack.length - 1];
                try {
                    // console.log(JSON.stringify(activityStack));
                    // For now function will share memory
                    let nextFunction = functions_1.default[activity.next](activityStack[0].memory);
                    var fnCode = nextFunction[0];
                    const hasFnCode = ['<', '>', '%', '#'].includes(fnCode);
                    // console.log(nextFunction);
                    if (hasFnCode) {
                        if (nextFunction.length <= 1)
                            nextFunction = activity.next;
                        else
                            nextFunction = nextFunction.substring(1);
                    }
                    else {
                        fnCode = '#';
                    }
                    // console.log(nextFunction);
                    switch (fnCode) {
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
                catch (e) {
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
exports.default = activityScheduler;


/***/ }),

/***/ "./marquis.screeps.ch/activities/room.ts":
/*!***********************************************!*\
  !*** ./marquis.screeps.ch/activities/room.ts ***!
  \***********************************************/
/*! flagged exports */
/*! export __esModule [provided] [no usage info] [missing usage info prevents renaming] */
/*! export default [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_exports__, __webpack_require__ */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const CreepFactory_1 = __webpack_require__(/*! ../creep/CreepFactory */ "./marquis.screeps.ch/creep/CreepFactory.ts");
const utils_1 = __webpack_require__(/*! ../utils/utils */ "./marquis.screeps.ch/utils/utils.ts");
const ActivityScheduler_1 = __webpack_require__(/*! ./ActivityScheduler */ "./marquis.screeps.ch/activities/ActivityScheduler.ts");
const FUNCTIONS_1 = __webpack_require__(/*! ../constants/FUNCTIONS */ "./marquis.screeps.ch/constants/FUNCTIONS.ts");
const STAGES = [
    function (room, memory) {
        const spawn = Game.spawns[memory.spawnName];
        if (spawn.spawning)
            return 0;
        const newCreepName = CreepFactory_1.default.generateName("worker", 1);
        if (CreepFactory_1.default.worker(spawn, 1, newCreepName) !== OK)
            return 0;
        ActivityScheduler_1.default.push({ next: FUNCTIONS_1.default.GATHER, memory: { creepName: newCreepName } });
        return 1;
    },
    function (room, memory) {
        const spawn = Game.spawns[memory.spawnName];
        if (spawn.spawning)
            return 0;
        const newCreepName = CreepFactory_1.default.generateName("worker", 1);
        if (CreepFactory_1.default.worker(spawn, 1, newCreepName) !== OK)
            return 0;
        ActivityScheduler_1.default.push({ next: 'createWorker', memory: { creepName: newCreepName } });
        return 1;
    },
    function (room, memory) {
        // TODO: Draw roads between all buildings and resources and exits
        // Then align buildings in a circle around spawn
        return 1;
    },
    function (room, memory) {
        return 0;
    }
];
const functionsRoom = {
    ROOM_CHECK_REPAIR: function (memory) {
        const room = Game.rooms[memory.roomName];
        const repairTargets = room.find(FIND_STRUCTURES, {
            filter: structure => (structure.hits / structure.hitsMax) < .6
        });
        const currentRepairActivities = ActivityScheduler_1.default.query(FUNCTIONS_1.default.REPAIR);
        for (let k in repairTargets) {
            const repairTarget = repairTargets[k];
            // if (currentRepairActivities.findIndex((a: any) => a.repairTargetId === repairTarget.id) < 0)
            //     activityScheduler.push({ next: FUNCTIONS.REPAIR, memory: { repairTargetId: repairTarget.id } });
        }
        return 'kill';
    }
};
function room(memory) {
    const room = Game.rooms[memory.roomName];
    if (memory.iter < 0)
        memory.iter = 0;
    // if (typeof memory.stage !== "number")
    //     memory.stage = 0;
    if (!memory.spawnName)
        memory.spawnName = utils_1.default.getSpawnFromRoom(room.name);
    // if (STAGES[memory.stage])
    //     memory.stage += STAGES[memory.stage](room, memory);
    if (memory.iter % 15 === 0) {
        const currentRepairActivities = ActivityScheduler_1.default.query(FUNCTIONS_1.default.REPAIR);
        if (currentRepairActivities.length === 0)
            ActivityScheduler_1.default.push({ next: FUNCTIONS_1.default.REPAIR, memory: {} });
    }
    memory.iter++;
    return FUNCTIONS_1.default.ROOM;
}
exports.default = room;
;


/***/ }),

/***/ "./marquis.screeps.ch/constants/FUNCTIONS.ts":
/*!***************************************************!*\
  !*** ./marquis.screeps.ch/constants/FUNCTIONS.ts ***!
  \***************************************************/
/*! flagged exports */
/*! export __esModule [provided] [no usage info] [missing usage info prevents renaming] */
/*! export default [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_exports__ */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const FUNCTIONS = {
    BUILD: 'build',
    UPGRADE: 'upgrade',
    REPAIR: 'repair',
    GATHER: 'gather',
    CREATE_CREEP: 'createCreep',
    COLLECT: 'collect',
    TRANSFER: 'transfer',
    ROOM: 'room',
    TOWER: 'tower',
    ROOM_CHECK_REPAIR: 'roomCheckRepair'
};
exports.default = FUNCTIONS;


/***/ }),

/***/ "./marquis.screeps.ch/constants/STRUCTURE_BUILD_PRIORITIES.ts":
/*!********************************************************************!*\
  !*** ./marquis.screeps.ch/constants/STRUCTURE_BUILD_PRIORITIES.ts ***!
  \********************************************************************/
/*! flagged exports */
/*! export __esModule [provided] [no usage info] [missing usage info prevents renaming] */
/*! export default [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_exports__ */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const STRUCTURE_BUILD_PRIORITIES = {
    [STRUCTURE_ROAD]: 0,
    [STRUCTURE_SPAWN]: 1,
    [STRUCTURE_EXTENSION]: 2,
    [STRUCTURE_TOWER]: 3,
    [STRUCTURE_WALL]: 4
};
exports.default = STRUCTURE_BUILD_PRIORITIES;
// STRUCTURE_WALL: "constructedWall",
// STRUCTURE_RAMPART: "rampart",
// STRUCTURE_KEEPER_LAIR: "keeperLair",
// STRUCTURE_PORTAL: "portal",
// STRUCTURE_CONTROLLER: "controller",
// STRUCTURE_LINK: "link",
// STRUCTURE_STORAGE: "storage",
// STRUCTURE_OBSERVER: "observer",
// STRUCTURE_POWER_BANK: "powerBank",
// STRUCTURE_POWER_SPAWN: "powerSpawn",
// STRUCTURE_EXTRACTOR: "extractor",
// STRUCTURE_LAB: "lab",
// STRUCTURE_TERMINAL: "terminal",
// STRUCTURE_CONTAINER: "container",
// STRUCTURE_NUKER: "nuker",
// STRUCTURE_FACTORY: "factory",
// STRUCTURE_INVADER_CORE: "invaderCore",


/***/ }),

/***/ "./marquis.screeps.ch/creep/CreepFactory.ts":
/*!**************************************************!*\
  !*** ./marquis.screeps.ch/creep/CreepFactory.ts ***!
  \**************************************************/
/*! flagged exports */
/*! export __esModule [provided] [no usage info] [missing usage info prevents renaming] */
/*! export default [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_exports__ */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
function calculateBodyCost(bodyParts) {
    let totalCost = 0;
    for (let i in bodyParts) {
        totalCost += BODYPART_COST[bodyParts[i]];
    }
    return totalCost;
}
function getMaxCreepLevel(type, capacity) {
    let bodyConfigs = CREEP_BODY_LOOKUP[type];
    for (let i = bodyConfigs.length - 1; i >= 0; i--) {
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
exports.default = {
    getMaxLevel: function (spawn, type) {
        const roomEnergyAvailable = spawn.room.energyAvailable;
        return getMaxCreepLevel(type, roomEnergyAvailable);
    },
    generateName: function (type, level) {
        const mem = Memory;
        const creepIndex = mem.creepIndex;
        if (typeof creepIndex !== "number")
            mem.creepIndex = 0;
        return `${type}-L${("" + level).padStart(3, "0")}-${mem.creepIndex++}`;
    },
    worker: function (spawn, level, name) {
        return spawn.spawnCreep(CREEP_BODY_LOOKUP['worker'][level], name);
    }
};


/***/ }),

/***/ "./marquis.screeps.ch/functions.ts":
/*!*****************************************!*\
  !*** ./marquis.screeps.ch/functions.ts ***!
  \*****************************************/
/*! flagged exports */
/*! export __esModule [provided] [no usage info] [missing usage info prevents renaming] */
/*! export default [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_exports__, __webpack_require__ */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const room_1 = __webpack_require__(/*! ./activities/room */ "./marquis.screeps.ch/activities/room.ts");
const CreepFactory_1 = __webpack_require__(/*! ./creep/CreepFactory */ "./marquis.screeps.ch/creep/CreepFactory.ts");
const STRUCTURE_BUILD_PRIORITIES_1 = __webpack_require__(/*! ./constants/STRUCTURE_BUILD_PRIORITIES */ "./marquis.screeps.ch/constants/STRUCTURE_BUILD_PRIORITIES.ts");
const FUNCTIONS_1 = __webpack_require__(/*! ./constants/FUNCTIONS */ "./marquis.screeps.ch/constants/FUNCTIONS.ts");
exports.default = {
    [FUNCTIONS_1.default.ROOM]: room_1.default,
    [FUNCTIONS_1.default.CREATE_CREEP]: function (memory) {
        const creep = Game.creeps[memory.creepName];
        if (creep)
            return FUNCTIONS_1.default.GATHER;
        if (!memory.spawnName)
            memory.spawnName = Object.keys(Game.spawns)[0];
        const spawn = Game.spawns[memory.spawnName];
        if (spawn.spawning)
            return FUNCTIONS_1.default.CREATE_CREEP;
        const creepLevel = CreepFactory_1.default.getMaxLevel(spawn, 'worker');
        const newCreepName = CreepFactory_1.default.generateName('worker', 1);
        const spawnCode = CreepFactory_1.default.worker(spawn, creepLevel, newCreepName);
        if (spawnCode !== OK)
            return FUNCTIONS_1.default.CREATE_CREEP;
        memory.creepName = newCreepName;
        return FUNCTIONS_1.default.GATHER;
    },
    [FUNCTIONS_1.default.GATHER]: function (memory) {
        const creep = Game.creeps[memory.creepName];
        if (!creep)
            return FUNCTIONS_1.default.CREATE_CREEP;
        if (creep.spawning)
            return FUNCTIONS_1.default.GATHER;
        var sources = creep.room.find(FIND_SOURCES);
        let harvestCode = creep.harvest(sources[0]);
        if (harvestCode === ERR_NOT_IN_RANGE) {
            creep.moveTo(sources[0], { visualizePathStyle: { stroke: '#ffff44' }, reusePath: 15 });
            return FUNCTIONS_1.default.GATHER;
        }
        if (harvestCode === OK && creep.store.getFreeCapacity(RESOURCE_ENERGY) > 0)
            return FUNCTIONS_1.default.GATHER;
        // Decide what to do next
        const structureCountWithFreeCapacity = creep.room.find(FIND_STRUCTURES, {
            filter: structure => (structure.structureType == STRUCTURE_EXTENSION ||
                structure.structureType == STRUCTURE_SPAWN ||
                structure.structureType == STRUCTURE_TOWER) &&
                structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0
        }).length;
        if (structureCountWithFreeCapacity > 0)
            return FUNCTIONS_1.default.TRANSFER;
        if (creep.room.find(FIND_CONSTRUCTION_SITES).length > 0)
            return FUNCTIONS_1.default.BUILD;
        return FUNCTIONS_1.default.UPGRADE;
    },
    [FUNCTIONS_1.default.TRANSFER]: function (memory) {
        const creep = Game.creeps[memory.creepName];
        if (!creep)
            return FUNCTIONS_1.default.CREATE_CREEP;
        if (creep.store.getUsedCapacity(RESOURCE_ENERGY) === 0)
            return FUNCTIONS_1.default.GATHER;
        const transferTarget = creep.room.find(FIND_STRUCTURES, {
            filter: structure => (structure.structureType == STRUCTURE_EXTENSION ||
                structure.structureType == STRUCTURE_SPAWN ||
                structure.structureType == STRUCTURE_TOWER) &&
                structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0
        })[0];
        if (!transferTarget)
            return FUNCTIONS_1.default.BUILD;
        const transferCode = creep.transfer(transferTarget, RESOURCE_ENERGY);
        if (transferCode === ERR_NOT_IN_RANGE) {
            creep.moveTo(transferTarget, { visualizePathStyle: { stroke: '#ffff44' }, reusePath: 15 });
            return FUNCTIONS_1.default.TRANSFER;
        }
        if (creep.store.getUsedCapacity(RESOURCE_ENERGY) > 0)
            return FUNCTIONS_1.default.TRANSFER;
        return FUNCTIONS_1.default.GATHER;
    },
    [FUNCTIONS_1.default.UPGRADE]: function (memory) {
        const creep = Game.creeps[memory.creepName];
        if (!creep)
            return FUNCTIONS_1.default.CREATE_CREEP;
        if (creep.store.getUsedCapacity(RESOURCE_ENERGY) === 0)
            return FUNCTIONS_1.default.GATHER;
        const upgradeCode = creep.upgradeController(creep.room.controller);
        if (upgradeCode === ERR_NOT_IN_RANGE) {
            creep.moveTo(creep.room.controller, { visualizePathStyle: { stroke: '#44FF44' }, reusePath: 15 });
            return FUNCTIONS_1.default.UPGRADE;
        }
        if (upgradeCode === OK && creep.store.getUsedCapacity(RESOURCE_ENERGY) > 0)
            return FUNCTIONS_1.default.UPGRADE;
        return FUNCTIONS_1.default.GATHER;
    },
    [`${FUNCTIONS_1.default.CREATE_CREEP}2`]: function (memory) {
        const creep = Game.creeps[memory.creepName];
        if (creep)
            return '<';
        if (!memory.spawnName)
            memory.spawnName = Object.keys(Game.spawns)[0];
        const spawn = Game.spawns[memory.spawnName];
        if (spawn.spawning)
            return '#';
        const creepLevel = CreepFactory_1.default.getMaxLevel(spawn, 'worker');
        const newCreepName = CreepFactory_1.default.generateName('worker', creepLevel);
        const spawnCode = CreepFactory_1.default.worker(spawn, creepLevel, newCreepName);
        if (spawnCode !== OK)
            return '#';
        memory.creepName = newCreepName;
        return '<';
    },
    [`${FUNCTIONS_1.default.GATHER}2`]: function (memory) {
        const creep = Game.creeps[memory.creepName];
        if (!creep)
            return '<';
        if (creep.spawning)
            return '#';
        var sources = creep.room.find(FIND_SOURCES);
        let harvestCode = creep.harvest(sources[0]);
        if (harvestCode === ERR_NOT_IN_RANGE) {
            creep.moveTo(sources[0], { visualizePathStyle: { stroke: '#ffff44' }, reusePath: 15 });
            return `#`;
        }
        if (harvestCode === OK && creep.store.getFreeCapacity(RESOURCE_ENERGY) > 0)
            return `#`;
        return '<';
    },
    [FUNCTIONS_1.default.REPAIR]: function (memory) {
        // console.log("repair you sucker!!!!!", JSON.stringify(memory));
        const creep = Game.creeps[memory.creepName];
        if (!creep)
            return `>${FUNCTIONS_1.default.CREATE_CREEP}2`;
        // Keep claiming creep so this activity can run next tick.
        creep.memory.claim = Game.time;
        if (creep.store.getUsedCapacity(RESOURCE_ENERGY) === 0)
            return `>${FUNCTIONS_1.default.GATHER}2`;
        let repairTarget = Game.getObjectById(memory.structureId);
        if (!repairTarget || repairTarget.hits > repairTarget.hitsMax - 100) {
            repairTarget = creep.room.find(FIND_STRUCTURES, {
                filter: structure => structure.hits !== structure.hitsMax
            }).sort((a, b) => (a.hits / a.hitsMax) - (b.hits / b.hitsMax))[0];
            memory.structureId = repairTarget.id;
        }
        const repairCode = creep.repair(repairTarget);
        if (repairCode === ERR_NOT_IN_RANGE) {
            creep.moveTo(repairTarget);
            return '#';
        }
        if (repairCode === OK && repairTarget.hits < repairTarget.hitsMax)
            return '#';
        return '#';
    },
    [FUNCTIONS_1.default.BUILD]: function (memory) {
        const creep = Game.creeps[memory.creepName];
        if (!creep)
            return FUNCTIONS_1.default.CREATE_CREEP;
        if (creep.store.getUsedCapacity(RESOURCE_ENERGY) === 0)
            return FUNCTIONS_1.default.GATHER;
        var target = creep.room.find(FIND_CONSTRUCTION_SITES)
            .sort((constructionSiteA, constructionSiteB) => STRUCTURE_BUILD_PRIORITIES_1.default[constructionSiteA.structureType] - STRUCTURE_BUILD_PRIORITIES_1.default[constructionSiteB.structureType])[0];
        if (!target)
            return FUNCTIONS_1.default.GATHER;
        const buildCode = creep.build(target);
        if (buildCode === ERR_NOT_IN_RANGE) {
            creep.moveTo(target, { visualizePathStyle: { stroke: '#22FF22' }, reusePath: 15 });
            return FUNCTIONS_1.default.BUILD;
        }
        if (buildCode === OK && creep.store.getUsedCapacity(RESOURCE_ENERGY) > 0)
            return FUNCTIONS_1.default.BUILD;
        return FUNCTIONS_1.default.GATHER;
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
};


/***/ }),

/***/ "./marquis.screeps.ch/main.ts":
/*!************************************!*\
  !*** ./marquis.screeps.ch/main.ts ***!
  \************************************/
/*! unknown exports (runtime-defined) */
/*! runtime requirements: __webpack_exports__, module, __webpack_require__ */
/*! CommonJS bailout: module.exports is used directly at 4:0-14 */
/***/ ((module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const ActivityScheduler_1 = __webpack_require__(/*! ./activities/ActivityScheduler */ "./marquis.screeps.ch/activities/ActivityScheduler.ts");
module.exports = function () {
    ActivityScheduler_1.default.init();
    // for as long as we have cpu to spend
    ActivityScheduler_1.default.run();
};


/***/ }),

/***/ "./marquis.screeps.ch/utils/utils.ts":
/*!*******************************************!*\
  !*** ./marquis.screeps.ch/utils/utils.ts ***!
  \*******************************************/
/*! flagged exports */
/*! export __esModule [provided] [no usage info] [missing usage info prevents renaming] */
/*! export default [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_exports__ */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.default = {
    harvestEnergy: function (creep) {
        var sources = creep.room.find(FIND_SOURCES);
        if (creep.harvest(sources[0]) == ERR_NOT_IN_RANGE)
            creep.moveTo(sources[0]);
    },
    transferEnergy: function (creep, structure) {
        if (creep.transfer(structure, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
            creep.moveTo(structure);
    },
    getSpawnFromRoom: function (roomName) {
        for (let spawnName in Game.spawns) {
            const spawn = Game.spawns[spawnName];
            if (spawn.room.name === roomName)
                return spawnName;
        }
        return null;
    }
};


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	// module exports must be returned from runtime so entry inlining is disabled
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__("./marquis.screeps.ch/main.ts");
/******/ })()
;