/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('manager.object');
 * mod.thing == 'a thing'; // true
 */

module.exports = {
    
    getControllerIdsArray: function() {
        return _.keys(getControllers());
    },
    
    getControllers: function() {
        return _.pick(Game.structures, function(structure) { return structure.structureType === STRUCTURE_CONTROLLER; } );
    },
    
    getControllersArray: function() {
        return _.filter(Game.structures, function(structure) { return structure.structureType === STRUCTURE_CONTROLLER; } );
    },
    
    getExtendedControllers: function() {
        var ext_controller = require('extension.controller');
        var controllers = this.getControllers();
        return _.mapValues(controllers, function(ctrl) { return ext_controller.extend(ctrl); })
    },
    
    getControllerById: function(id) {
        
    },
    
    getControllerByRoomName: function(room) {
        
    }
};