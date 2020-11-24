module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./marquis.screeps.ch/impl/main.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./marquis.screeps.ch/impl/activities/ActivityScheduler.ts":
/*!*****************************************************************!*\
  !*** ./marquis.screeps.ch/impl/activities/ActivityScheduler.ts ***!
  \*****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const functions_1 = __webpack_require__(/*! ../functions */ "./marquis.screeps.ch/impl/functions.ts");
class ActivityScheduler {
    init() {
        const mem = Memory;
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
                this.push({ next: "runRoom", memory: { roomName: roomName } });
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
    push(state) {
        const mem = Memory;
        mem.nextActivities.push(state);
    }
    schedule() {
        const mem = Memory;
        mem.activities.unshift.apply(mem.activities, mem.nextActivities);
        mem.nextActivities = [];
    }
    run() {
        console.log(`---{ Tick ${Game.time} }--------------------`);
        const mem = Memory;
        while (mem.activities.length > 0) {
            const state = mem.activities.pop();
            if (state) {
                // console.log("Next state", state);
                // console.log("Running activity: ", JSON.stringify(state));
                try {
                    var nextFunction = functions_1.default[state.next](state.memory); // can return flags like 'kill'
                    state.next = nextFunction;
                }
                catch (e) {
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
exports.default = activityScheduler;


/***/ }),

/***/ "./marquis.screeps.ch/impl/activities/room.ts":
/*!****************************************************!*\
  !*** ./marquis.screeps.ch/impl/activities/room.ts ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const CreepFactory_1 = __webpack_require__(/*! ../creep/CreepFactory */ "./marquis.screeps.ch/impl/creep/CreepFactory.ts");
const utils_1 = __webpack_require__(/*! ../utils/utils */ "./marquis.screeps.ch/impl/utils/utils.ts");
const ActivityScheduler_1 = __webpack_require__(/*! ../activities/ActivityScheduler */ "./marquis.screeps.ch/impl/activities/ActivityScheduler.ts");
const STAGES = [
    function (room, memory) {
        const spawn = Game.spawns[memory.spawnName];
        if (spawn.spawning)
            return 0;
        const newCreepName = CreepFactory_1.default.generateName("worker", 1);
        if (CreepFactory_1.default.worker(spawn, 1, newCreepName) !== OK)
            return 0;
        ActivityScheduler_1.default.push({ next: 'runWorker', memory: { creepName: newCreepName } });
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
function runRoom(memory) {
    const room = Game.rooms[memory.roomName];
    if (typeof memory.stage !== "number")
        memory.stage = 0;
    if (!memory.spawnName) {
        memory.spawnName = utils_1.default.getSpawnFromRoom(room.name);
    }
    if (STAGES[memory.stage])
        memory.stage += STAGES[memory.stage](room, memory);
    return "runRoom";
}
exports.default = runRoom;
;


/***/ }),

/***/ "./marquis.screeps.ch/impl/creep/CreepFactory.ts":
/*!*******************************************************!*\
  !*** ./marquis.screeps.ch/impl/creep/CreepFactory.ts ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
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
        const roomEnergyCapacity = spawn.room.energyCapacityAvailable;
        return getMaxCreepLevel(type, roomEnergyCapacity);
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

/***/ "./marquis.screeps.ch/impl/functions.ts":
/*!**********************************************!*\
  !*** ./marquis.screeps.ch/impl/functions.ts ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const room_1 = __webpack_require__(/*! ./activities/room */ "./marquis.screeps.ch/impl/activities/room.ts");
const CreepFactory_1 = __webpack_require__(/*! ./creep/CreepFactory */ "./marquis.screeps.ch/impl/creep/CreepFactory.ts");
exports.default = {
    runRoom: room_1.default,
    runWorkerCreateCreep: function (memory) {
        const creep = Game.creeps[memory.creepName];
        if (creep)
            return 'runWorkerSourcing';
        if (!memory.spawnName)
            memory.spawnName = Object.keys(Game.spawns)[0];
        const spawn = Game.spawns[memory.spawnName];
        if (spawn.spawning)
            return 'runWorkerCreateCreep';
        const creepLevel = CreepFactory_1.default.getMaxLevel(spawn, 'worker');
        const newCreepName = CreepFactory_1.default.generateName('worker', 1);
        const spawnCode = CreepFactory_1.default.worker(spawn, creepLevel, newCreepName);
        if (spawnCode !== OK)
            return 'runWorkerCreateCreep';
        memory.creepName = newCreepName;
        return 'runWorkerSourcing';
    },
    createWorker: function (memory) {
        const creep = Game.creeps[memory.creepName];
        if (!creep)
            return 'runWorkerCreateCreep';
        return 'runWorkerSourcing';
    },
    runWorkerSourcing: function (memory) {
        const creep = Game.creeps[memory.creepName];
        if (!creep)
            return 'runWorkerCreateCreep';
        if (creep.spawning)
            return 'runWorkerSourcing';
        var sources = creep.room.find(FIND_SOURCES);
        let harvestCode = creep.harvest(sources[0]);
        if (harvestCode === ERR_NOT_IN_RANGE) {
            creep.moveTo(sources[0], { visualizePathStyle: { stroke: '#ffff44' }, reusePath: 15 });
            return 'runWorkerSourcing';
        }
        if (harvestCode === OK && creep.store.getFreeCapacity(RESOURCE_ENERGY) > 0)
            return 'runWorkerSourcing';
        if (memory.taskIndex === 0) {
            memory.taskIndex = 1;
            const structureCountWithFreeCapacity = creep.room.find(FIND_STRUCTURES, {
                filter: structure => (structure.structureType == STRUCTURE_EXTENSION ||
                    structure.structureType == STRUCTURE_SPAWN ||
                    structure.structureType == STRUCTURE_TOWER) &&
                    structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0
            }).length;
            if (structureCountWithFreeCapacity > 0)
                return 'runWorkerTransferEnergy';
            if (creep.room.find(FIND_CONSTRUCTION_SITES).length > 0)
                return 'runWorkerBuilding';
        }
        memory.taskIndex = 0;
        return 'runWorkerUpgrading';
    },
    runWorkerTransferEnergy: function (memory) {
        const creep = Game.creeps[memory.creepName];
        if (!creep)
            return 'runWorkerCreateCreep';
        const transferTarget = creep.room.find(FIND_STRUCTURES, {
            filter: structure => (structure.structureType == STRUCTURE_EXTENSION ||
                structure.structureType == STRUCTURE_SPAWN ||
                structure.structureType == STRUCTURE_TOWER) &&
                structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0
        })[0];
        if (!transferTarget) {
            return 'runWorkerUpgrading';
        }
        const transferCode = creep.transfer(transferTarget, RESOURCE_ENERGY);
        if (transferCode === ERR_NOT_IN_RANGE) {
            creep.moveTo(transferTarget, { visualizePathStyle: { stroke: '#ffff44' }, reusePath: 15 });
            return 'runWorkerTransferEnergy';
        }
        return 'runWorkerSourcing';
    },
    runWorkerUpgrading: function (memory) {
        const creep = Game.creeps[memory.creepName];
        if (!creep)
            return 'runWorkerCreateCreep';
        const upgradeCode = creep.upgradeController(creep.room.controller);
        if (upgradeCode === ERR_NOT_IN_RANGE) {
            creep.moveTo(creep.room.controller, { visualizePathStyle: { stroke: '#44FF44' }, reusePath: 15 });
            return 'runWorkerUpgrading';
        }
        if (upgradeCode === OK && creep.store.getCapacity(RESOURCE_ENERGY) > 0) {
            return 'runWorkerUpgrading';
        }
        return 'runWorkerSourcing';
    },
    runWorkerRepairing: function (memory) {
        // Find damaged buildings
        // Repair until no more energy
        return 'runWorkerSourcing';
    },
    runWorkerBuilding: function (memory) {
        const creep = Game.creeps[memory.creepName];
        if (!creep)
            return 'runWorkerCreateCreep';
        var target = creep.room.find(FIND_CONSTRUCTION_SITES)[0];
        if (!target)
            return 'runWorkerSourcing';
        const buildCode = creep.build(target);
        if (buildCode === ERR_NOT_IN_RANGE) {
            creep.moveTo(target, { visualizePathStyle: { stroke: '#22FF22' }, reusePath: 15 });
            return 'runWorkerBuilding';
        }
        if (buildCode === OK && creep.store.getCapacity(RESOURCE_ENERGY) > 0)
            return 'runWorkerBuilding';
        return 'runWorkerSourcing';
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

/***/ "./marquis.screeps.ch/impl/main.ts":
/*!*****************************************!*\
  !*** ./marquis.screeps.ch/impl/main.ts ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const ActivityScheduler_1 = __webpack_require__(/*! ./activities/ActivityScheduler */ "./marquis.screeps.ch/impl/activities/ActivityScheduler.ts");
module.exports.loop = function () {
    ActivityScheduler_1.default.init();
    // for as long as we have cpu to spend
    ActivityScheduler_1.default.run();
};


/***/ }),

/***/ "./marquis.screeps.ch/impl/utils/utils.ts":
/*!************************************************!*\
  !*** ./marquis.screeps.ch/impl/utils/utils.ts ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
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

/******/ });