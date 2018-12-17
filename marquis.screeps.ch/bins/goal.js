var MemoryUtil = require('util.memory');

var Goal = {

  /** Constructor method to create a new Goal entity
   * @param {number} type - One of the type constants.
   * @param {string} targetID - Id of the target.
   * @param {Object} info - Object where everyone can write information to.
   */
  object: function(type, targetID, info){
    this.type = type;
    this.targetID = targetID;
    this.id = "goal_".concat(Goal._getNewId());
    this.creationTime = Game.time;
    this.parentID; // The parent goal id.
    this.childID; // The child goal id.

    this.info = info;
  },

  /** Goals that alter the behaviour of a controller
   */
  TYPES: {
    /** Requires more hosts for activities.
     * And should result in taking over a new controller.
     * -> Until the controller reached a certain control level
     * and or took over another controller.
     */
    EXPAND: 1,
    /** Try to control a room. Without taking the controller.
     * -> Until the room is under control for a specified amount of time.
     */
    CONTROL: 2,
    /** Position military creeps and or buildings close to an enemy players rooms.
     * -> Until the enemy player left the room or other player attacks.
     */
    INTIMIDATE: 3,
    /** Make small attacks and block of paths of enemy creeps.
     * This potentially disarms a room.
     * -> Until a specified amount of time or other player is removed.
     */
    TERRORIZE: 4,
    /** Destroy all buildings and kill all creeps inside a room.
     * -> Until all buildings and creeps of a player are destroyed.
     */
    DESTROY: 5,
    /** Make profits on the market or try to directly trade with a close player.
     * -> Until a certain amount of profit has been done.
     */
    TRADE: 6,
    /** Send pieceful messages to a player and avoid any hostile actions.
     * -> Until an answer has been received or the ambassador was attacked.
     */
    MAKE_PIECE: 7,
    /** Just survive. Keep energy containers filled up and create military
     * creeps and buildings to defend the controller.
     * -> Until for a certain amount of time no more hostile actions were done.
     */
    SURVIVE: 8,
    /** Protect another controller and its rooms.
     * Create military creeps and send them. Position them inbetween foe and friend.
     * -> until for a certain amount of time no more hostile actions were done.
     */
    PROTECT: 9,
    /** Try to cap passages of enemy creeps. Do this by positioning non hostile creeps
     * in a line as barrier. Destroy and military buildings first.
     * -> Until for a certain amount of time or any creep has been attacked.
     */
    HANDICAP: 10,
    /** Maintain all structures inside a room.
     * -> Until a certain amount of time or always.
     */
    MAINTAIN: 11,
    /** Supply creeps and buildings for planned attacks of friendly players.
     * -> Until enough buildings and creeps have been created and orders were given.
     */
    SUPPORT: 12,
    /** Create a few military creeps and keep towers supplied with energy.
     * Position them between a potential thread and some key buildings or creeps.
     * -> Until a certain time and no hostile actions were done or was attacked.
     */
    CAUTIOUS: 13,
    /** Send a message to another player.
     * -> Until the message was sent for a certain amount of time or answer has been received.
     * or the ambassador has been attacked.
     */
    MESSAGE: 14,
    /** Send creeps and collect information about resources.
     * When specified resource has been found then send creeps their to collect the resource.
     * -> Until resource has been found or too far away.
     */
    FIND_RESOURCE: 15,
    /** Try to collect some resources. Make a passage there if necessary.
     * This is a long term goal.
     * -> Until a certain amount has been collected or always.
     */
    COLLECT_RESOURCE: 16
  },

  /** The global memory object of this class.
   * @static
   * @property
   */
  glbMem: function() {
    return MemoryUtil.getMemory(MemoryUtil.SECURITY.GLOBAL, "goal", MemoryUtil.STANDARDS.STATIC);
  }(),

  /** Creates a new id for gaols.
   * @static
   * @private
   * @return {number} A new id number.
   */
  _getNewId: function() {
		if(Goal.glbMem.lastId === undefined)
			Goal.glbMem.lastId === 0;
    Goal.glbMem.lastId += 1;
		return ( Goal.glbMem.lastId * 1000 ) + ( Math.floor( Math.random() * 1000 ) );
	}
};

module.exports = Goal;
