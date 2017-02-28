var manager_task = require('manager.task');
var role_tower = require('role.tower');
var mngr_object = require('manager.object');

var taskCreationCycle = 15;

module.exports.loop = function () {
    
    manager_task.registerTick();
	if(Game.time % taskCreationCycle === 0) { manager_task.run(); }
	
    var controllers = mngr_object.getExtendedControllers();
    for(var controller in controllers) { controller = controllers[controller];
        //ext_controller.extend(controller);
        controller.run();
    }
    
    role_tower.run(Game.getObjectById('58a68d4d5ef060f3422d875e'));
}


// STANDARD

/**
 * Convert a string containing two comma-separated numbers into a point.
 * @param {string} str - The string containing two comma-separated numbers.
 * @return {Point} A Point object.
 */

// CONSTRUCTOR FUNCTION

/**
 * Represents a book.
 * @constructor
 * @param {string} title - The title of the book.
 * @param {string} author - The author of the book.
 */

// INLINE TAGS

/**
 * Set the shoe's color. Use {@link Shoe#setSize} to set the shoe size.
 *
 * @param {string} color - The shoe's color.
 */
 
/**
 * Set the shoe's color.
 *
 * @param {SHOE_COLORS} color - The shoe color. Must be an enumerated
 * value of {@link SHOE_COLORS}.
 */
 
/**
 * Set the color and type of the shoelaces.
 *
 * @param {LACE_COLORS} color - The shoelace color.
 * @param {LACE_TYPES} type - The type of shoelace.
 */
 
// MODULES

/**
 * Pants module.
 * @module my/pants
 * @see module:my/shirt
 */
 
// PROPERTIES

/**
 * @namespace
 * @property {object}  defaults               - The default values for parties.
 * @property {number}  defaults.players       - The default number of players.
 * @property {string}  defaults.level         - The default level for the party.
 * @property {object}  defaults.treasure      - The default treasure.
 * @property {number}  defaults.treasure.gold - How much gold the party starts with.
 */

// SPECIAL

/**
 * @deprecated since version 2.0
 */

/** @const {number} */



