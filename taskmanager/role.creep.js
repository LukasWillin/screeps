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
        //all taskNames stored in memory property
        //get the actual task from task_manager
        //evaluate urgency of given tasks
        //decide whether own goals or given tasks should be executed
        //if no task is currently set -> get new task
        //then execute task
        //check whether the task can be processed of this creep anyways if not pass it back to the manager and request a new task
        //try {
        var manager_task = require('manager.task');
        if(creepObject.memory.task) {
            var task = manager_task.getTaskByName(creepObject.memory.task);
            
            // TODO remove if possible
            if (creepObject.memory.taskInfo === undefined) 
                creepObject.memory.taskInfo = {};
            if (creepObject.memory.taskInfo.subTasks === undefined) 
                creepObject.memory.taskInfo.subTasks = {};
            if (creepObject.memory.taskInfo.subTasks.harvest === undefined)
                creepObject.memory.taskInfo.subTasks.harvest = {};

            if(task) {
                
                task = this.doTask(creepObject, task);
                manager_task.setTask(task, creepObject.memory.task);
            } else {
                creepObject.memory.task = undefined;
                delete creepObject.memory.taskInfo;
            }
        } else {
            if(creepObject.ticksToLive % 4 === 0) {

                creepObject.memory.task = manager_task.getTaskByBody(creepObject.body);
                creepObject.memory.taskInfo = {};
            }
        }
        /*} catch (err) {
            if (err.name == "TypeError") {
                creepObject.memory.task = undefined;
            }
        }*/
        
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