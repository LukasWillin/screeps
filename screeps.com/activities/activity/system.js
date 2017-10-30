
/**
 * The activity system is the main access for activities
 * and allows for a standardized interface to run and manage all of them.
 * This class will also handle updating the activities.
 *
 * @type {Object}
 */
var ActivitySystem = {

  /**
   * Creates a new managed activity that will be executed by the scheduler.
   * The custom method must be like the following and can return a roomID {number}.
   *    cMethod(argsByCopy, dataByRef)
   * If a roomID is returned it will replace the old roomID.
   *
   * @param  {Object} args - Arguments by object.
   *    @property {string} roomID - ID of the room which is considered the execution environment.
   *    @property {string} hostID - ID of the host on which the activity is executed.
   *    @property {Object} execArgs - Arguments that will be handed to the host as copy.
   *    @property {Object} data - Data container object that is handed to the host by reference.
   *    @property {number} type - A type constant.
   *    @property {string} customMethodName - Method name of a custom method if type constant is ANY.
   */
  create: function(args) {
    var activity = Activity.create(args);

    _activitySet[activity.ID] = activity;

    // Notify the scheduler.
  },
  
  /**
   * Executes the activity with ID.
   * @param  {number} ID - ID of the activity.
   */
  execute: function(ID) {
    var activity = _mem['activites'][ID];
    var host = ObjectSystem.getObjectByID(activity.hostID);

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

  _mem: (function() {
    MemoryUtil.getMemory(MemoryUtil.SECURITY.PRIVATE, "activity.system")
  })(),

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
      HOST_METHOD_NOT_FOUND: 1,
      METHOD_NOT_MEMBER_OF_HOST: 2
    },
    CREATE: {
      UNSUFFICIENT_ARGUMENTS: 20
    }
  }
};

module.exports = ActivitySystem

/*

 Must be done by the scheduler
 BASE_PRIORITY: {
   IDLE: 0,
   LOW: 1,
   LOWER_THAN_NORMAL: 2,
   NORMAL: 3,
   HIGHER_THAN_NORMAL: 4,
   HIGH: 5,
   VERY_HIGH: 6,
   REAL_TIME: 7
 }
 */
