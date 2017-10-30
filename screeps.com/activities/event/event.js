var MemoryUtil = require('util.memory');

var Event = {

  /** Constructor to create a new event.
   * A new event should only be created if there is no similar event.
   * @constructor
   * @param {number} type - One of the type constants.
   * @param {string} creatorID - Id of the creator.
   * @param {string} triggerID - Id of the trigger.
   * @param {string} playerID - Id of the player.
   * @param {Room} roomName - Room where the event occured.
   * @param {Object} info - Container for miscellaneous information.
   */
  object: function(type, creatorID, triggerID, playerID, roomName, info){
    this.type = type;
    this.id = "event_".concat(Event._getNewId());
    this.creationTime = Game.time;
    this.lastUpdated = Game.time;
    this.creatorID = creatorID;
    this.triggerID = triggerID;
    this.playerID = playerID;
    this.roomName = roomName;
    this.count = 0;

    this.info = info;
  },

  //
  // -+-+-{ STATIC API }-+-+-
  //

  /** Compares to events and returns true if they are similar.
   * The comparison takes type, playerID, roomName & lastUpdated into account.
   * @static
   * @param {Event} eventOne The first event.
   * @param {Event} eventTwo The second event.
   * @return {boolean} True when similar. Otherwise false.
   */
  areSimilar: function(eventOne, eventTwo) {

      if(eventOne.type === eventTwo.type
        && eventOne.playerID === eventTwo.playerID
        && eventOne.roomName === eventTwo.roomName
        && (
              // Newer event is not younger than old event + 100
              !(eventOne.lastUpdated > (eventTwo.lastUpdated + 100))
              // Older event is not older than new event - 100
          ||  !(eventOne.lastUpdated < (eventTwo.lastUpdated - 100))
        ) ) {
          return true;
      } else {
        return false;
      }
  },

  /** Iterates the occurence counter of the event.
   * @static
   * @param {Event} event The reoccured event.
   */
  countUp = function(event) {
    event.count += 1;
    event.updated();
  },

  /** Updated the lastUpdated property to Game.time.
   * @static
   * @param {Event} event THe updated event.
   */
  updated = function(event) {
    event.lastUpdated = Game.time;
  },

  //
  // -+-+-{ PRIVATE STATIC }-+-+-
  //

  /** Creates a new unique id for events.
   * @static
   * @private
   * @return {number} a new id number.
   */
  _getNewId: function() {
		if(Event.glbMem.lastId === undefined)
			Event.glbMem.lastId === 0;

    Event.glbMem.lastId += 1;
		return ( Event.glbMem.lastId * 1000 ) + (Math.floor( Math.random() * 1000 ));
	},

  /** Global memory object of the static Event.
   * @static
   * @property
   */
  glbMem: function() {
    return util_memory.getMemory(MemoryUtil.SECURITY.GLOBAL, "event", MemoryUtil.STANDARDS.STATIC);
  }(),

  /** Type constants for events.
   * @static
   * @const {Object}
   *    @property {number} Number constants.
   */
  TYPES: {
    // In game events
    CREEP_ATTACKED: 1,
    ENEMY_CREEP_SPOTTED: 2,
    UNKNOWN_CREEP_SPOTTED: 3,
    NEUTRAL_CREEP_SPOTTED: 4,
    FRIENDLY_CREEP_SPOTTED: 5,
    ENEMY_STRUCTURE_SPOTTED: 6,
    UNKNOWN_STRUCTURE_SPOTTED: 7,
    SPECIAL_STRUCTURE_SPOTTED: 8,
    ROOM_ATTACKED: 9,
    STRUCTURE_ATTACKED: 10,
    NPC_HOSTILE_CREEP_SPOTTED: 11,
    NPC_HOSTILE_STRUCTURE_SPOTTED: 12
  }

};

module.exports = Event;
