/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('manager.task.room');
 * mod.thing == 'a thing'; // true
 */
var manager_task = require('manager.task');

module.exports = {
    
    checkForTasks: function(roomName) {
        var room = Game.rooms[roomName];
        this.check_ConstructionSites_ForTasks(room)
    },
    
    check_ConstructionSites_ForTasks: function(room) {
        var myConstrSites = room.find(FIND_MY_CONSTRUCTION_SITES);
        var structure = room.find(FIND_MY_SPAWNS)[0];
        if(myConstrSites.length > 0) {
            for(var i = 0; i < myConstrSites.length; i++) { 
                var targetId = myConstrSites[i]['id'];
                this.createBuildTask(structure, targetId);
            }
        }
    },
    
    createBuildTask: function(structure, constructionSiteId) {
        var taskParts = manager_task.createTask(structure, 'task.structure.build', constructionSiteId);
        return manager_task.setTask(taskParts.taskObject, taskParts.taskName);
    },
};