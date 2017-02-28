
module.exports = {
    /**
     * @param {Controller} controller - Needed to identify to whom the creeps belong.
     * @param {Object} ops - Options can contain following keys:
     *      @property {number} ops.type - Any of the TYPE.CONST values. Standard is WORKER.     
     *      @property {number} ops.amount - Number of given type to spawn. Standard is 1.
     *      @property {boolean} ops.company - If true it will create [amount] companies (military). A company is formed by 3 or more creeps. Standard is false. Standard type (if undefined) is KNIGHT.
     *      @property {boolean} ops.battalion - If true it will assign newly created creeps from [amount] companies to one battalion (military). Standard is false.
     *      @property {number} ops.energyAvailable - If set this value will be taken instead of controller.room.energyCapacityAvailable.
     * 
     * @return {Object} taskList - An object containing all 'ActionSpawn's with keys as their ID.
     */
    getSpawnActions: function(controller, ops) {
        
        if(ops === undefined) ops = {};
        if(ops.amount === undefined || ops.amount < 1) ops.amount = 1;
        if(ops.type === undefined) ops.type = this.TYPE.WORKER;
        if(ops.energyAvailable === undefined || ops.energyAvailable < 1) ops.energyAvailable = controller.room.energyCapacityAvailable;
        if(ops.battalion) ops.company = true;
        
        var spawnActions;

        if(ops.company) {
            
        } else {
            var body;
            var bodyMethod;
            switch(ops.type) {
                case this.TYPE.WORKER:
                    bodyMethod = this.getBody_Worker; break;
                case this.TYPE.CARRIER:
                    bodyMethod = this.getBody_Carrier; break;
                case this.TYPE.HEALER:
                    bodyMethod = this.getBody_Healer; break;
                case this.TYPE.AMBASSADOR:
                    bodyMethod = this.getBody_Ambassador; break;
                case this.TYPE.KNIGHT:
                    bodyMethod = this.getBody_Knight; break;
                case this.TYPE.MARKSMAN:
                    bodyMethod = this.getBody_Marksman; break;
            }
            body = this.getBest_Body(bodyMethod, energyAvailable);
            
            for(var i = 0; i < ops.amount; i++) {
                
            }
        }

        return spawnActions;
    },
    
    /** gets the best possible body
     * 
     */
    getBest_Body: function(bodyMethod, energyAvailable) {
        var body;
        var lvl = 0;
        var cost = 0;
        var i = 0;
        while(cost < energyAvailable) {
            
        }
        
        return body;
    },
    
    getBody_Worker: function(lvl, body) {
        
    },
    
    getBody_Carrier: function(lvl) {
        
    },
    
    getBody_Healer: function(lvl) {
        
    },
    
    getBody_Ambassador: function() {
        
    },
    
    getBody_Knight: function(lvl) {
       
    },
    
    getBody_Marksman: function(lvl) {
        
    },
    
    WORKER_CLASS: {
        LVL_1: [WORK, CARRY, MOVE, MOVE],
        LVL_2: [WORK, WORK, CARRY, MOVE, MOVE, MOVE],
        LVL_3: [WORK, WORK, WORK, CARRY, MOVE, MOVE, MOVE, MOVE]
    },
    
    /** @const {Object} */
    TYPE: {
        /** @const {number} */
        WORKER: 1,
        /** @const {number} */
        CARRIER: 2,
        /** @const {number} */
        HEALER: 3,
        /** @const {number} */
        AMBASSADOR: 4,
        /** @const {number} */
        KNIGHT: 5,
        /** @const {number} */
        MARKSMAN: 6
    },
    
    getNewBattalionId: function() {
        if(Memory.usedIds === undefined)
            Memory.usedIds = {};
        if (Memory.usedIds.battalionId === undefined)
            Memory.usedIds.battalionId = 0;
        Memory.usedIds.battalionId += 1;
        var battalionId = Memory.usedIds.battalionId;
        return (battalionId*1000) + Math.floor(Math.random()*1000);
    },
    
    getNewCompanyId: function() {
        if(Memory.usedIds === undefined)
            Memory.usedIds = {};
        if (Memory.usedIds.companyId === undefined)
            Memory.usedIds.companyId = 0;
        Memory.usedIds.companyId += 1;
        var companyId = Memory.usedIds.companyId;
        return (companyId*1000) + Math.floor(Math.random()*1000);
    }
};