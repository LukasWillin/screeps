/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('manager.logistic');
 * mod.thing == 'a thing'; // true
 */

module.exports = {
    
    run: function() {
        
        // call findTasks 
        // forEach task try to assign it
    },
    
    findTasks: function() {
        return ; //return all taskNames ordered by urgency in an array
    },
    
    link: function(structure, structure) {
        
    },
    
    checkRoadHealth: function() {
        
    },
    
    assignTask: function(task) {
        // assign task to a creep
        // call getAvailableCarrierCreeps
    },
    
    /**
     * 
     * @param Array of existing carrier creepNames
     */
    getClosestCarrierCreep: function(creepNames) {
        return ; // return closest of given creep names
    },
    
    /**
     * Returns an array of creepNames meeting the following properties
     * own task is 60% done
     * The given urgencyLvl is higher than the urgency of own task
     * 
     * @param {urgencyLvl} urgencyLvl
     */
    getAvailableCarrierCreeps: function(urgencyLvl) {
        // get all carrier creeps
        // return the creep meeting these requirements
        // should already be close to where he should start the task
        // his task progress should be at least 60%
        // the task is very urgent and needs to e done before any other
    },
    
    getAllCarrierCreeps: function() {
        return ; // return all creeps that are marked as carriers
    }
};