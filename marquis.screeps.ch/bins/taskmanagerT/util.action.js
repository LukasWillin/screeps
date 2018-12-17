/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('util.action');
 * mod.thing == 'a thing'; // true
 */

module.exports = {
    /** @param {Action} action
     * @param {ActionName} actionName
     */
    setAction: function(action, actionName) {
        if(!actionName && action) {
            actionName = action.nameBase + '_' + this.getNewActionId(); //create a new unique task name
            
            var taskList = this.getTaskList();
            taskList[taskName] = taskObject;
            this._setTaskList(taskList); //save new task list in memory

            //console.log('Set new task < ' + taskName + ' > created by < '+ taskObject.creatorId + ' >');
        } else {
            if(!taskObject) {
                
                this._deleteTask(taskName);
            } else {
                var taskList = this.getTaskList();
                taskList[taskName] = taskObject;
                this._setTaskList(taskList); //save new task list in memory
    
                //console.log('Saved updated Task < ' + taskName + ' > created by < '+ taskObject.creatorId + ' >');
            }
        }
        
        return taskName;
    },
    
    /** Get a task by task name **/
    getTaskByName: function(taskName) {
        return this.getTaskList()[taskName];
    },
    
    getTaskByBody: function(body){
        var abilities = _.map(body, 'type');

        abilities = _.uniq(abilities); //this.getUniqueParts(body);

        var mostUrgentTask_Name;
        var lastHighestUrgencyLvl = -1000;
        var taskList = this.getTaskList();
        
        for(var taskName in taskList) {
            var bodySuitedForTask = true; // check if assumption is false
            
            
            var currUrgencyLvl = this.calcTaskUrgencyLvl(taskName);

            if(currUrgencyLvl > lastHighestUrgencyLvl) {
                var task = taskList[taskName];
                
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
        var taskList = this.getTaskList();
        taskList = _.pick(taskList, function(value, key, object) {
            return (value.creatorId === creatorId && value.nameBase === taskNameBase);
        });
        
        if(Object.keys(taskList).length > 0) {
            return taskList;
        }
    },
    
    getExistingTaskName: function(creatorId, taskNameBase, targetId){
        var taskList = this.getTaskList();
        var taskKey = _.findKey(taskList, function(task){
            return (task.creatorId === creatorId && task.nameBase === taskNameBase && task.targetId === targetId);
        });
        return taskKey;
    },
    
    /** Returns the task list as object **/
    getTaskList: function() {
        var taskList = Memory['taskList'];
        if(!taskList) {
            taskList = {};
        }
        return taskList;
    },
    
    registerTick: function() {
        var taskList = this.getTaskList();
        for(var key in taskList) {
            taskList[key].age = taskList[key].age + 1;
        }
        //this._setTaskList(taskList);
    },
    
    calcTaskUrgencyLvl: function(taskName) {
        var taskList = this.getTaskList();
        var taskObject = taskList[taskName];
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
    
    _setActionList: function(actionList) {
        Memory['actionList'] = actionList;
    },
        
    _deleteTask: function(actionName) {
        console.log('Deleting action < ' + actionName + ' >');
        var actionList = this.getActionList();
        delete actionList[actionName];
        this._setActionList(actionList);
    }
};