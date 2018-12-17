/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.creep');
 * mod.thing == 'a thing'; // true
 */
 
var role_creep = {
    
    /**
     * Make the creep run his tasks
     */
    run: function(creepObject) {
        var ext_creep = require('extension.creep');
        
        ext_creep.extendCreep(creepObject);
        
        var manager_task = require('manager.task');
        
        if(creepObject.memory.task) {
            var task = manager_task.getTaskByName(creepObject.memory.task);
            if(task) {
                
                task = this.doTask(creepObject, task);
                manager_task.setTask(task, creepObject.memory.task);
            } else {
                creepObject.memory.task = undefined;
                delete creepObject.memory.taskInfo;
            }
        } else {
            if(creepObject.ticksToLive % 3 === 0) {

                creepObject.memory.task = manager_task.getTaskByBody(creepObject.body);
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
        
    },
    
    WORKER_CLASS: {
        LVL_1: [WORK, CARRY, MOVE, MOVE],
        LVL_2: [WORK, WORK, CARRY,   MOVE, MOVE, MOVE],
        LVL_3: [WORK, WORK, WORK, CARRY,   MOVE, MOVE, MOVE, MOVE]
    }
}

module.exports = role_creep;