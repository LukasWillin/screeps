
/**
 * This is a util to manage the memory.
 * Get a reference to a memory object by calling 'getMemory'
 *
 * The util will build a directory structure like so:
 * [package][standard][custom][identifier]
 *
 * An Alias can be set so that the memory is moved before returned.
 *
 * @class
 */
MemoryUtil = {

	/**
	 * Get memory by path (and or alias) and or identifier
	 * All params and configuration options are treated in the following order.
	 * -> [config.package][config.standard][config.custom][identifier]
	 * The [config.alias] is used to transfer data from an old memory
	 * object/directory to a new directory.
	 *
	 * @function
	 *
	 * @param {string} identifier - Specific directory. Can be an ID or the name
	 * of a single object (like an util).
	 * @param {MemoryPathConfig} config - Configuration options.
	 * @return {MemoryObject} - The requested memory object.
	 */
	getMemory: function(identifier, config) {},

	/**
	 * A reference to the memory object managed by the memoty util.
	 * @name MemoryObject
	 * @class
	 */

	/**
 	 * Some general package names.
 	 * The package names refer to the development folders.
 	 *
 	 * @static
 	 * @enum
 	 */
 	PACKAGE: {
 		/** @static
		  * @type {string}
		  */
 		ACTIVITY: "activity",
 		/**
 		 * @static
 		 * @type {String}
 		 */
 		EVENT: "event",
 		/**
 		 * @static
 		 * @type {String}
 		 */
 		OBJECT: "object",
 		/**
 		 * @static
 		 * @type {String}
 		 */
 		UTIL: "util",
 		/**
 		 * @static
 		 * @type {String}
 		 */
 		RESOURCE: "resource",
 		/**
 		 * @static
 		 * @type {String}
 		 */
 		GAME: "game" // for game objects eg creeps > ID enough to keep them apart ?
 	},

	/**
	 * Enum for some standard directories to
 	 * seperate memory by usage or prototype/class.
 	 *
 	 * @static
 	 * @enum
 	 */
 	STANDARDS: {
 		/**
 		 * @static
 		 * @type {String}
 		 */
 		SYSTEM: "system",
 		/**
 		 * @static
 		 * @type {String}
 		 */
 		CREEP: "creeps",
 		/**
 		 * @static
 		 * @type {String}
 		 */
 		STRUCTURE: "structures",
 		/**
 		 * @static
 		 * @type {String}
 		 */
 		SOURCE: "sources"
 	}
};

/**
 * An object containing optional configuration options.
 * These options will alter the path to the memory object.
 *
 * @type {Object}
 */
MemoryPathConfig: {
	/**
	 * @type {PACKAGE}
	 */
	package: "",
	/**
	 * @type {STANDARD}
	 */
	standard: "",
	/**
	 * @type {String}
	 */
	custom: "",
	/**
	 * An alias path can be provided when using different identifier and/or
	 * configuration. The memory util will then copy all contents from the
	 * alias memory object to the new memory object.
	 * @type {String}
	 */
	alias: ""
};
