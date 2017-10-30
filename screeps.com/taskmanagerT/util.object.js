/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('util.object');
 * mod.thing == 'a thing'; // true
 */

module.exports = {
    
    getControllerIdsArray: function() {
        return _.keys(getControllers());
    },
    
    getExtendedStructuresByType: function(typeConst) {
        var ext_mod = require(this.EXTENSION_MODULES[typeConst]);
        var structures = this._structuresByType(typeConst);
        return _.mapValues(structures, function(structure) { return ext_mod.extend(structure); })
    },
    
    getExtendedControllers: function() {
        var ext_controller = require(this.EXTENSION_MODULES[STRUCTURE_CONTROLLER]);
        var controllers = this._controllers();
        return _.mapValues(controllers, function(ctrl) { return ext_controller.extend(ctrl); });
    },
    
    /*_controllersArray: function() {
        return _.filter(Game.structures, function(structure) { return structure.structureType === STRUCTURE_CONTROLLER; } );
    },*/
    
    getControllerById: function(id) {
        
    },
    
    getControllerByRoomName: function(room) {
        
    },
    
    _structuresByType: function(typeConst) {
        return _.pick(Game.structures, function(structure) { return structure.structureType === typeConst; } );
    },
    
    _controllers: function() {
        return _.pick(Game.structures, function(structure) { return structure.structureType === STRUCTURE_CONTROLLER; } );
    },
    
    EXTENSION_MODULES: {
        'controller': 'extension.controller',
        "room": 'extension.room'
    }
    
    /*
    LOOK_CREEPS: "creep",
    LOOK_ENERGY: "energy",
    LOOK_RESOURCES: "resource",
    LOOK_SOURCES: "source",
    LOOK_MINERALS: "mineral",
    LOOK_STRUCTURES: "structure",
    LOOK_FLAGS: "flag",
    LOOK_CONSTRUCTION_SITES: "constructionSite",
    LOOK_NUKES: "nuke",
    LOOK_TERRAIN: "terrain",

    OBSTACLE_OBJECT_TYPES: ["spawn", "creep", "wall", "source", "constructedWall", "extension", "link", "storage", "tower", "observer", "powerSpawn", "powerBank", "lab", "terminal","nuker"],
    
    STRUCTURE_SPAWN: "spawn",
    STRUCTURE_EXTENSION: "extension",
    STRUCTURE_ROAD: "road",
    STRUCTURE_WALL: "constructedWall",
    STRUCTURE_RAMPART: "rampart",
    STRUCTURE_KEEPER_LAIR: "keeperLair",
    STRUCTURE_PORTAL: "portal",
    STRUCTURE_CONTROLLER: "controller",
    STRUCTURE_LINK: "link",
    STRUCTURE_STORAGE: "storage",
    STRUCTURE_TOWER: "tower",
    STRUCTURE_OBSERVER: "observer",
    STRUCTURE_POWER_BANK: "powerBank",
    STRUCTURE_POWER_SPAWN: "powerSpawn",
    STRUCTURE_EXTRACTOR: "extractor",
    STRUCTURE_LAB: "lab",
    STRUCTURE_TERMINAL: "terminal",
    STRUCTURE_CONTAINER: "container",
    STRUCTURE_NUKER: "nuker",
    */
};