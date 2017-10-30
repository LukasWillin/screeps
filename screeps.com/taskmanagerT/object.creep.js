/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('object.creep');
 * mod.thing == 'a thing'; // true
 */
 
var util_task = require('util.task');
var ext_creep = require('extension.creep');
 
var role_creep = {
    
    /**
     * Make the creep run his tasks
     */
    run: function(creepObject) {
        
        ext_creep.extendCreep(creepObject);
        
        
        if(creepObject.memory.task) {
            var task = util_task.getTaskByName(creepObject.memory.task);
            if(task) {
                
                task = this.doTask(creepObject, task);
                util_task.setSharedTask(task, creepObject.memory.task);
            } else {
                creepObject.memory.task = undefined;
                delete creepObject.memory.taskInfo;
            }
        } else {
            if(creepObject.ticksToLive % 3 === 0) {

                creepObject.memory.task = util_task.getTaskByBody(creepObject.body);
                creepObject.memory.taskInfo = {};
            }
        }
    },
    
    /**
     * Should not be called from outside
     */
    doTask: function(creepObject, taskObject) {
        
        var taskModule = require(taskObject.module);
        if( ( creepObject.ticksToLive % 7 ) === 0) {
            var word = taskObject.nameBase.substring(4);
            creepObject.say(word);
        }
        return taskModule.run(creepObject, taskObject);
    },
    
    getCurrentTaskName: function(creepName){
        return Game.creeps[creepName].task;
    },
    
    checkForTasks: function(creep) {
        
    }
}

module.exports = role_creep;