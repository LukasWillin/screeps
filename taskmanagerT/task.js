/**
 * No usable Code
 * 
 * Only describe module code that should inherit from this module
 */
 
/* Basic task module functions

    run():                  > processes the task
    ??subTasks():             > returns tasks required for this task
    createObject():         > Calls new this.object() after all calculations have been made
    object():               > object constructor function to create a task object, that can then be processed with this module
    NAME_BASE:              > base name for a task object
    MODULE:                 > name of the module required to process a task created from the same module
*/
 
 
/* basic task object structure

    nameBase:           > Containing the basic name of the task
    subTasks            > Array containing all subtasks needed for this task
                        theyre being created during the run method of the module and then appended to this list
                        the last entry being the most important that should be finished first
    module:             > Containing the name of the module required to process the task object
    creatorId:          > Id of the creator may be changed from outside
    progressPercentage: > Containing the progress of the task - this can either increase or decrease the urgency lvl
    urgencyLvl:         > starting at Lvl 1 the urgencyLvl can increase or be higher depending on how urgent the completion of the task is
                        urgencyLvl 0 or lower marks the task object as done and should be deleted
    age:                > for how many ticks the task has not been done - this can increase the urgency lvl
    factor:             > a factor that is used to calculate the impact of age (ticks) on the urgency of this task
    assignedCreeps:     > array with ids of assigned creeps
    requiredBodyParts:  > array of required BodyParts
    sourceId:           > id of the source
    targetId            > id of the target
    
    room:               > roomName
*/

module.exports = {};

{
    /** @param {Creep} creep 
        @param {taskObject} task object to be run
    **/
    run: function(creep, taskObject) {
	    // TODO: Code to process the task object
	},
	
	subTasks: function() {
	    // TODO: Return needed tasks as object
	},
	
	createObject: function(progressPercentage, urgencyLvl, targetId, sourceId) {
	    var room = Game.getObjectById(targetId).room.name;
	    return new this.object(this.NAME_BASE, this.MODULE, progressPercentage, urgencyLvl, targetId, sourceId, room);
	},
	
	object: function(nameBase, module, progressPercentage, urgencyLvl, targetId, sourceId, room, subTasks) {
	        this.nameBase = nameBase;
	        this.module = module;
	        this.room = room;
	        
	        this.creatorId = ''; // must be set after creation from outside
	        this.progressPercentage = progressPercentage;
	        this.urgencyLvl = urgencyLvl;
	        this.subTasks = subTasks;
	        this.factor = 0.1; // TODO set this factor with a value between 0.1 and 1.0
	        this.assignedCreeps = [];
	        
	        this.targetId = targetId;
	        this.sourceId = sourceId;
	        this.requiredBodyParts = [];
	        // TODO: Add more properties if required
	},
	
	NAME_BASE: 'nameBase',
	
	MODULE:'task.name.name'
}