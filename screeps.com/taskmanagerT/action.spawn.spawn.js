/*
 * 
 */

module.exports = {

    /** @deprecated */
    run: function() {
        //actions are smaller than tasks
        //and should be run directly by a function from the object to minimize overhead
    },
	
	createObject: function(urgencyLvl, body, type, lvl, companyId, battalionId, requiredEnergy) {
	    return new this.object(this.NAME_BASE, this.MODULE, urgencyLvl, room, body, type, lvl, companyId, battalionId, requiredEnergy);
	},
	
	object: function(nameBase, module, urgencyLvl, room, body, type, lvl, companyId, battalionId, requiredEnergy) {
	        this.nameBase = nameBase;
	        this.module = module;
	        this.room = room;
	        
	        this.creatorId = null; // must be set after creation from outside
	        this.urgencyLvl = urgencyLvl;
	        
	        this.factor = 0.1; // TODO set this factor with a value between 0.1 and 1.0
	        
	        this.type = type;
	        this.body = body;
	        this.lvl = lvl;
	        this.companyId = companyId;
	        this.battalionId = battalionId;
	        this.requiredEnergy = requiredEnergy;
	},
	
	NAME_BASE: 'actionSpawn',
	
	MODULE:'action.spawn.spawn'
};