
/** A scheduler is able to manage a list of activities.
 * A scheduler prioritizes them according to goals and events of the room which created an activity.
 * He then runs a set of functions to prioritize the acitivity list.
 * Then he runs the activites through the activity System.
 */
var Scheduler = {

  run: function() {
    // update priority list
    // select and handle activity until cpu constraints.
  },

  /** Handles the given activity via ActivitySystem.
   * @private
   * @param  {[type]} activity [description]
   * @return {[type]}          [description]
   */
  _handleActivity(activity) {

  },

  /**
   * Returns the next activity from the priority list.
   * @private
   * @return {Activity} The next activity.
   */
  _selectNextFromActivityPriorityList: function() {

  },

  /** Recalculating priorities for activities and reorders the list accordingly.
   * @private
   */
  _updateActivityPriorityList: function() {

  },

  /**
   * Calculates a priority for given activity.
   * @param  {Activity} actvity
   * @return {number}         The priority.
   */
  _calculateActivityPriority(actvity) {

  },

  /** A list which stores all activities together with calculated priorities and factors.
   * It should be updated often.
   * @private
   * @type {Array}
   */
  _activityPriorityList: []
};

module.export = Scheduler;
