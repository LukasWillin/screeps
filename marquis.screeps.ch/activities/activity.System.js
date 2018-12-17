
/**
 * The activity system is the main access for activities
 * and allows for a standardized interface to run and manage all of them.
 * This class will also handle updating the activities.
 *
 * @type {Object}
 */
var ActivitySystem = {
  /* @type {String}
   * Not is use since implicitly sepcified by package:=activity
   * & standard:=system
   */
  // identifier: 'ActivitySystem'

  /**
   * Creates a new managed activity that will be executed by the scheduler.
   * The custom method must be like the following and can return a roomID {number}.
   *    cMethod(argsByCopy, dataByRef)
   * If a roomID is returned it will replace the old roomID.
   *
   * @param {Object} args - Arguments by object.
   * @param {String} args.roomID  - ID of the room which is considered the execution environment.
   * @param {String} args.hostID  - ID of the host on which the activity is executed.
   * @param {Object} args.execArgs - Arguments that will be handed to the host as copy.
   * @param {Object} args.data    - Data container object that is handed to the host by reference.
   * @param {number} args.type    - A type constant.
   * @param {string} args.customMethodName - Method name of a custom method if type constant is ANY.
   */
  create: function(args) {
    var activity = Activity.create(args);

    _activitySet[activity.ID] = activity;

    // Notify the scheduler.
  },

  /**
   * Executes the activity with ID.
   * @param  {number} ID - ID of the activity.
   * @return {ReturnMessage} A return message.
   */
  execute: function(ID) {
    var activity = _mem['activites'][ID];
    var host = ObjectSystem.getObjectByID(activity.hostID);

    if(host === undefined || host === null) {
      return;
    }

    var methodName;
    // Select method name by activity type

    if(methodName === undefined || methodName === null) {
        //LogUtil.log();
        return;
    }

  },

  /** @private
   * Return the DataObject of activity with ID.
   * Returns null if there is no such managed ID.
   * @param  {number} activityID    - ID of the activity.
   * @return {Activity:DataObject}  - The data object of the activity.
   */
  _get(activityID) {

  },

  /** @private
   * Removes the managed activity from the list.
   * Returns activityID on success.
   * @param  {number} activityID - The ID of the activity.
   * @return {number}            - The ID of the deleted activity if did exist.
   */
  _remove(activityID) {

  },

  /** @private
   * Adds the given activity to the list of managed activities.
   * Will fail when ID already exists. The system must then provide another id.
   * @param {Activity:DataObject} activity  - DataObject of an activity.
   * @param {number}                        - The ID of the activity when it could be added.
   */
  _add(activity) {

  },

  /** @private
   * Private memory object reference.
   * @return {Object<String, Any} Memory object.
   */
  _mem: (function() {
    MemoryUtil.getMemory(
      MemoryUtil.STANDARDS.SYSTEM,
      {package: MemoryUtil.PACKAGE.ACTIVITY});
  })(),

  /** @private
   * Private set of activities.
   * @return {[type]} [description]
   */
  _activitySet: (function() {
    var ACTIVITY_SET_PROPERTY_NAME = 'activitySet';
    if(_mem[ACTIVITY_SET_PROPERTY_NAME] === undefined
        || _mem[ACTIVITY_SET_PROPERTY_NAME] === null) {
            _mem[ACTIVITY_SET_PROPERTY_NAME] = [];
    }
    return _mem[ACTIVITY_SET_PROPERTY_NAME];
  })(),

  RESULTS: {
    EXECUTE: {
      HOST_NOT_FOUND: 0,
      HOST_METHOD_NOT_FOUND: 1,
      METHOD_NOT_MEMBER_OF_HOST: 2,
      SUCCESS: 3,
      EXCEPTION_THROWN: 4
    },
    CREATE: {
      UNSUFFICIENT_ARGUMENTS: 20
    }
  }
};

module.exports = ActivitySystem
