
var role_creep = require('role.creep');

module.exports = {
    
    extend: function(controller) {
        
        /**
         * Call this to make things run
         */
        controller.run = function() {
            for(var i = 0; i < this.creeps.length; i++)
                role_creep.run(this.creeps[i]);
                
            if(this.memory.tick === undefined)
                this.memory.tick = 1;
                
            this.memory.tick += 1;
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
        
        return controller;
    }
};