
var util_task = require('util.task');

module.exports = {
    
    extend: function(controller) {
        var role_creep = require('object.creep');
        
        
        /* Extend controller so he can manage his own tasks */
        controller = _.merge(controller, util_task);
        
        // Extend Controller with own functions
        
        controller.manageTasks = function(){
            var structureModule = require('manager.task.structure');
            var roomModule = require('manager.task.room');
            
        
            // let structures and creeps create tasks
            for(var structureName in Game.structures) {
                structureModule.checkForTasks(Game.structures[structureName]);
            }
            for(var roomName in Game.rooms) {
                roomModule.checkForTasks(roomName);
            }
        };
        
        /** HashList containing all controlled creeps 
         * @type {HashList}
         */
        controller.creeps = function() { return _.filter(Game.creeps, (creep) => {
            return (!creep.spawning && creep.memory.affiliation.controllerId === controller.id); })
        }();
        
        controller.memory = function() {
            if(Memory.controllers === undefined)
                Memory.controllers = {};
            if(Memory.controllers[controller.id] === undefined)
                Memory.controllers[controller.id] = {};
            var memory = Memory.controllers[controller.id]
            return memory;
        }();
        
        controller.ownTaskList = function() {
            var taskList = controller.generalTaskList;
                
            if(controller.memory.taskList === undefined)
                taskList = _.pick(taskList, function(task) { return task.controllerId === controller.id; });
                
            return taskList;
        }();
        
        controller.ticks = function() {
            if(controller.memory.ticks === undefined)
                controller.memory.ticks = 0;
            
            controller.memory.ticks += 1;
            
            return controller.memory.ticks;
        }();
        
        /**
         * Call this to make things run
         */
        controller.run = function() {
            
            if(controller.ticks % 15 == 0) this.manageTasks();
            
            for(var i = 0; i < this.creeps.length; i++)
                role_creep.run(this.creeps[i]);
        };
        
        return controller;
    }
};