var ObjectSystem = {

  /**
   * Get any object by id with extended prototype for more functionality.
   * @param  {string} objectID Id of the game object.
   * @return {Object}          The object with extended prototype.
   */
  getObjectById: function(objectID) {
    // Get the object for id
    var obj = Game.getObjectById(id);
    // TODO: Get the type of the object and...
    // TODO: ...extend its prototype if needed
    if(obj !== undefined) {
      if(obj instanceOf Creep) {

      } else if(obj instanceOf Structure) {
        if(obj instanceOf StructureContainer) {
          // TODO obj = ControllerExtension.extend(obj);
        }

      } else if(obj instanceOf Room) {

      } else if(obj instanceOf RoomObject) {

      }
      // Return the object.
      retrun obj;
    } else {
      throw { name: "NoSuchIdError",
              message: "There is no active object with id: ".concat(id) };
    }
  },

  _hasExtendedPrototype: function(object) {

  },

  /**
   * [description]
   * @return {[type]} [description]
   */
  _extendCreepPrototype: function() {

  }

  // TODO: Extend more prototypes
};

module.exports = ObjectManager;
