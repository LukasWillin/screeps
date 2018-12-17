
var manager_task = {
    /**
     * Creates tasks on it own
     * Deletes done tasks
     * Marks due tasks as urgent
     * Gives idle creeps tasks
     * Forces Creeps to do urgent tasks
     * Takes tasks requested from creeps
    */
    run: function() {
        
        this.manageTasks();
        console.log("Task creation");
    },
    
    manageTasks: function(){
        var structureModule = require('manager.task.structure');
        var roomModule = require('manager.task.room');
        

        // let structures and creeps create tasks
        for(var structureName in Game.structures) {
            structureModule.checkForTasks(Game.structures[structureName]);
        }
        for(var roomName in Game.rooms) {
            roomModule.checkForTasks(roomName);
        }
    },
    
    /** @param {taskObject} taskObject **/
    setTask: function(taskObject, taskName) {
        if(!taskName && taskObject) {
            taskName = taskObject.nameBase + '_' + this.getNewTaskId(); //create a new unique task name
            
            var taskList = this.getTaskList();
            taskList[taskName] = taskObject;
            this.setTaskList(taskList); //save new task list in memory

            //console.log('Set new task < ' + taskName + ' > created by < '+ taskObject.creatorId + ' >');
        } else {
            if(!taskObject) {
                
                this.deleteTask(taskName);
            } else {
                var taskList = this.getTaskList();
                taskList[taskName] = taskObject;
                this.setTaskList(taskList); //save new task list in memory
    
                //console.log('Saved updated Task < ' + taskName + ' > created by < '+ taskObject.creatorId + ' >');
            }
        }
        
        return taskName;
    },
    
    deleteTask: function(taskName) {
        console.log('Deleting task < ' + taskName + ' >');
        var taskList = this.getTaskList();
        delete taskList[taskName];
        this.setTaskList(taskList);
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
    
    setTaskList: function(taskList) {
        Memory['taskList'] = taskList;
    },
    
    /**
     * Creates a new unique id
     */
    getNewTaskId: function() {
        var lastTaskId = Memory['lastTaskId'];
        lastTaskId = (lastTaskId+1)%1000;
        Memory['lastTaskId'] = lastTaskId;
        return (lastTaskId*1000)+Math.floor(Math.random()*1000);
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
    
    getUniqueParts: function(a) {
        var seen = {};
        var out = [];
        var len = a.length;
        var j = 0;
        for(var i = 0; i < len; i++) {
             var item = a[i];
             if(seen[item] !== 1) {
                   seen[item] = 1;
               out[j++] = item;
             }
        }
        return out;
    },
    
    registerTick: function() {
        var taskList = this.getTaskList();
        for(var key in taskList) {
            taskList[key].age = taskList[key].age + 1;
        }
        this.setTaskList(taskList);
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
        
        if(processingCreeps > 0) {
            //console.log(processingCreeps);
            //console.log(result);
        }
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

        var taskName = manager_task.getExistingTaskName(structure.id, taskModule.NAME_BASE, targetId);
        var task = undefined;
        
        if(!taskName) { task = taskModule.createObject(0, 1, structure.id); } 
        else { task = manager_task.getTaskByName(taskName); }
        
        task.targetId = targetId;
        task.creatorId = structure.id;
        
        return { taskName: taskName, taskObject: task }
    },
}

module.exports = manager_task;
