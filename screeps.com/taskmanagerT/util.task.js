/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('util.memory.task');
 * mod.thing == 'a thing'; // true
 */

module.exports = {
    
    /** @param {taskObject} taskObject **/
    setSharedTask: function(taskObject, taskName) {
        if(!taskName && taskObject) {
            taskName = taskObject.nameBase + '_' + this.getNewTaskId(); //create a new unique task name
            
            this.generalTaskList[taskName] = taskObject;

            //console.log('Set new task < ' + taskName + ' > created by < '+ taskObject.creatorId + ' >');
        } else {
            if(!taskObject) {
                
                this._deleteTask(taskName);
            } else {
                this.generalTaskList[taskName] = taskObject;

                //console.log('Saved updated Task < ' + taskName + ' > created by < '+ taskObject.creatorId + ' >');
            }
        }
        
        return taskName;
    },
    
    /** Get a task by task name **/
    getTaskByName: function(taskName) {
        return this.generalTaskList[taskName];
    },
    
    getTaskByBody: function(body){
        var abilities = _.map(body, 'type');

        abilities = _.uniq(abilities); //this.getUniqueParts(body);

        var mostUrgentTask_Name;
        var lastHighestUrgencyLvl = -1000;
        
        for(var taskName in this.generalTaskList) {
            var bodySuitedForTask = true; // check if assumption is false
            
            
            var currUrgencyLvl = this.calcTaskUrgencyLvl(taskName);

            if(currUrgencyLvl > lastHighestUrgencyLvl) {
                var task = this.generalTaskList[taskName];
                
                var i = 0; while( bodySuitedForTask && i < task.requiredBodyParts.length ) {
                    lastHighestUrgencyLvl = currUrgencyLvl;
                    bodySuitedForTask = ( _.indexOf(abilities, task.requiredBodyParts[i]) != -1 ); 
                    i++;
                }
                
            } else {
                bodySuitedForTask = false;
            }
            
            if (bodySuitedForTask) { mostUrgentTask_Name = taskName; }
        }
        return mostUrgentTask_Name;
    },
    
    /**
     * Creates a new unique id
     */
    getNewTaskId: function() {
        if(Memory.usedIds === undefined)
            Memory.usedIds = {};
        if(Memory.usedIds.taskId === undefined)
            Memory.usedIds.taskId = 0;
        Memory.usedIds.taskId += 1;
        
        var taskId = (Memory.usedIds.taskId)%1000;
        return (taskId*1000)+Math.floor(Math.random()*1000);
    },
    
    /** Deprecated > Use getExistingTaskName() instead
     * TODO get _.pick working & only return task name
     * Returns a list of tasks by this creatorId and name base of task
     */
    getExistingTasks: function(creatorId, taskNameBase) {
        var taskList = this.generalTaskList;
        taskList = _.pick(taskList, function(value, key, object) {
            return (value.creatorId === creatorId && value.nameBase === taskNameBase);
        });
        
        if(Object.keys(taskList).length > 0) {
            return taskList;
        }
    },
    
    getExistingTaskName: function(creatorId, taskNameBase, targetId){
        var taskKey = _.findKey(this.generalTaskList, function(task){
            return (task.creatorId === creatorId && task.nameBase === taskNameBase && task.targetId === targetId);
        });
        return taskKey;
    },
    
    generalTaskList: function(){
        var taskList = Memory['taskList'];
        if(!taskList) {
            taskList = {};
            Memory.taskList = taskList;
        }
        return taskList;
    }(),
    
    registerTick: function() {
        for(var key in this.generalTaskList) {
            this.generalTaskList[key].age += 1;
        }
    },
    
    calcTaskUrgencyLvl: function(taskName) {
        var taskObject = this.generalTaskList[taskName];
        var processingCreeps = 0;
        for(var creep in Game.creeps) {
            creep = Game.creeps[creep];
            if(creep.memory.task !== undefined && creep.memory.task === taskName) { processingCreeps++; }
        }
        var creepsFactor = Math.pow(0.5, processingCreeps);
        var result = ((taskObject.urgencyLvl + (taskObject.age * taskObject.factor)) - (10*(taskObject.progressPercentage/100)))*creepsFactor;
        
        return result;
    },
    
    /**
     * Creates a basic task and returns an object with keys taskName and taskObject
     * @param {structure} structure
     * @param {taskModuleName} taskModuleName
     */
    createTask: function(structure, taskModuleName, targetId) { 
        var taskModule = require(taskModuleName);
    
        if(targetId === undefined) { targetId = structure.id; }

        var taskName = this.getExistingTaskName(structure.id, taskModule.NAME_BASE, targetId);
        var task = undefined;
        
        if(!taskName) { task = taskModule.createObject(0, 1, structure.id); } 
        else { task = this.getTaskByName(taskName); }
        
        task.targetId = targetId;
        task.creatorId = structure.id;
        
        return { taskName: taskName, taskObject: task }
    },
        
    _deleteTask: function(taskName) {
        console.log('Deleting task < ' + taskName + ' >');
        delete this.generalTaskList[taskName];
    }
};