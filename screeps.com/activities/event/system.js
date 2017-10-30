
/** This manager manages events and subscriptions.
 * This manager should be used to create a new event.
 * The subscriber will then also notify all subscribers to the created
 * event of type.
 * A subscription is stored in an Array<Object>
 * Objects in the array are subscriptionEntries and contain following information.
 * @property {string} id - The id of the subscriber.
 * @property {Array} eventTypes - The array with all event types for which the subscriber will be notified.
 * @property {Array} handlerFunctions - The array with all function names that are called when an event is raised.
 * Only one function is called for one event type. That is the function at the same index.
 * Following must be true:
 * {number} -> eventTypes.length === handlerFunctions.length
 * {number} -> eventTypeIndex === handlerFunctionIndex
 */
var EventSystem = {

  //
  // -+-+-{ SUBSCRIPTION API }-+-+-
  //

  /** Notify all subscribers subbed to type of given event.
   * and call their functions.
   * @private
   * @param {Event} event Object of the event.
   */
  _notifySubscribers: function(event) {
    var eventSubscribers = _.filter(_subscriptions,
      function(sub) { // return sub if event.type is found in his eventTypes
        return _.contains(sub.eventTypes,
          function(evT) { evT === event.type; } // conntains event.type
        );
      }
    );
    eventSubscribers = _.map(eventSubscribers, function(sub) {
      var eventIndex = _.findIndex(sub.eventTypes, function(evT) {
        return evT === event.type;
      });
      return { id: sub.id, handlerFunction: sub.handlerFunctions[eventIndex] };
    });
    _.forEach(eventSubscribers, function(sub) {
      var extObj = ObjectExtender.getExtObj(sub.id);
      extObj[sub.handlerFunction](event);
    });
  },

  /** Subscribe to the notification list for new events.
   * When an event is raised and is of one eventType specified in
   * eventTypes it will call the function at same index from the
   * handlerFunctions-Array.
   * @param {string} subscriberID The id of the object.
   * @param {Array} eventTypes An Array with event type const.
   * @param {Array} handlerFunctions Array with names of functions.
   */
  subscribeToMany: function(subscriberID, eventTypes, handlerFunctions) {
    if(eventTypes.length !== handlerFunctions.length)
      throw {name: "SubscriptionError", message: "eventTypes.length !== handlerFunctions.length" };

    var subscription = {
      this.id: subscriberID,
      this.eventTypes = eventTypes
      this.handlerFunctions = handlerFunctions
    }
    this._subscriptions.push(subscription);
  },

  /**
   * Unsubscribes the subscriber from all previously set events.
   * @param {string} subscriberID The id of the object.
   */
  unsubscribeFromAll: function(subscriberID) {
    var lastIndex = _subscriptions.length-1;
    var lastSubscription = _subscriptions[lastIndex];
    var subscriptionIndex = _.indexOf(_subscriptions, function(sub) {
      return sub.id === subscriberID;
    });
    _subscriptions[subscriptionIndex] = lastSubscription;
    _subscriptions.pop();
  },

  /**
   *
   */
  unsubscribeFromEvent: function(subscriberID, eventType) {
    var subEntry = _.find(_subscriptions, function(sub) {
      return sub.id === subscriberID;
    });
    if(subEntry.eventTypes.length !== subEntry.handlerFunctions.length)
      throw {name: "SubscriptionError", message: "eventTypes.length !== handlerFunctions.length"};

    var index = _.findIndex(subEntry.eventTypes, function(evT) {
      return evT === eventType;
    });
    var lastIndex = subEntry.eventTypes.length-1;
    subEntry.eventTypes[index] = subEntry.eventTypes[lastIndex];
    subEntry.handlerFunctions[index] = subEntry.handlerFunctions[lastIndex];
    subEntry.eventTypes.pop();
    subEntry.handlerFunctions.pop();
  },

  /** Registers the subscriber id to the event type.
   * The handler function will be called when such an event is raised.
   * @param {string} subscriberID The id of the subscriber.
   * @param {number} eventType The type constant of the event.
   * @param {string} handlerFunction The function to be called when
   *                 event of type is raised.
   */
  subscribeToEvent(subscriberID, eventType, handlerFunction) {
    var subEntry = _.find(_subscriptions, function(sub) {
      return subscriberID === sub.id;
    });
    if(subEntry.eventTypes.length !== subEntry.handlerFunctions.length)
      throw {name: "SubscriptionError", message: "eventTypes.length != handlerFunctions.length"};

    subEntry.eventTypes.push(eventType);
    subEntry.handlerFunctions.push(handlerFunction);
  },

  //
  // -+-+-{ EVENT API }-+-+-
  //

  /** Creates a new event and appends it to the event list.
   * A new event will only be created if there is no similar event.
   * @param {number} type One of the type constants.
   * @param {string} creatorID Id of the creator.
   * @param {string} triggerID Id of the trigger.
   * @param {string} playerID Id of the player.
   * @param {string} roomName Room where the event occured.
   * @param {Object} info Container for miscellaneous information.
   */
  registerEvent: function(type, creatorID, triggerID, playerID, roomName, info) {
    // TODO Check for duplicates > Then either create, update or reject event creation request
    var newEvent = new Event.object(type, creatorID, triggerID, playerID, roomName, info);
    _events[newEvent.id] = newEvent;
    _mem.lastRegisteredEventID = newEvent.id;
    _notifySubscribers(newEvent);
  },

  /** @deprecated Use registerEvent
   * Update an event.
   * Choose whether others should be notified about the change.
   * @param {Object} event The updated event object.
   * @param {boolean} notify True if subscribers should be notified.
   */
  update: function(event, notify) {
    _events[event.id] = event;
  },

  /** Returns the last registered event.
   * @return {Event} The last registered event.
   */
  getLatestEvent: function() {
    return (_mem.lastRegEvID) ? _events[_mem.lastRegEvID] : undefined;
  },

  /** Returns an Array with all events since time.
   * @param {number} time Time in ticks.
   * @return {Array} Array with event objects.
   */
  getEventsSince: function(time) {
    var eventsSince = _.filter(_events, function(ev) {
      return ev.creationTime >= time;
    });
    return eventsSince;
  },

  /** Returns the eventObject of given id.
   * @param {string} eventID Id of the event.
   * @return {Event} The event of id.
   */
  getEventById: function(eventID) {
    return _events[eventID];
  },

  //
  // -+-+-{ MEMORY && PROPERTIES }-+-+-
  //

  /**
   * Object referencing the private memory object in Memory.
   * @private
   * @property
   */
  _mem: function() {
    return MemoryUtil.getMemory(MemoryUtil.SECURITY.PRIVATE, "event", MemoryUtil.STANDARDS.MANAGER);
  }(),

  /**
   * The subscription list.
   * The subscriber is identifiable via id.
   * The events he subscribes to are defined in an Array eventTypes of const event type.
   * The handler function associated with an event type that should be called by the manager
   * is specified in a second array and should be set at the same index as the event type index
   * in the first array.
   * @private
   * @property
   */
  _subscriptions = function() {
    if(_mem && _mem.subscriptions === undefined)
      _mem.subscriptions = [];
    return this._mem.subscriptions;
  }(),

  /** Hash list containing event objects.
   * @private
   * @property
   */
  _events = function() {
    return MemoryUtil.getMemory(MemoryUtil.SECURITY.GLOBAL, "events");
  }
};

module.exports = EventSystem;
