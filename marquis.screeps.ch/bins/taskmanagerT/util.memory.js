/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('util.memory');
 * mod.thing == 'a thing'; // true
 */

module.exports = {

    /** Get memory by path
     * @param {string} path
     * @param {Object} ops
     *      @property {string} alias - Set if the memory path was different before
     *      @property {string} identifier
     * @return {Object} memory
     */
    getMemory: function(path, ops) {
        if(ops !== undefined && ops.alias !== undefined) {
            this.registerAlias(path, ops.alias);
        }
        path = this.getActiveAliasArray(path)[0];
        
        var pParts = this.getPathParts(path);
        
        var subMemory = this.getOrCreateSubMemory(pParts);
        
        return subMemory;
    },
    
    /** Returns the subMemory for a pathArray or undefined if it doesnt exist
     * @param {number} i - Current Iteration.
     * @param {Array} pParts - Path as Array.
     * @param {Object} subMemory - Current sub memory.
     * @return {Object} subMemory - The sub memory or undefined if it doesnt exist.
     */
    getSubMemory: function(pParts, i, subMemory){
        if(subMemory === undefined) subMemory = Memory;
        if(i === undefined) i = 0;
        
        if(subMemory[pParts[i]] === undefined) {
            return undefined;
        } else {
            subMemory = subMemory[pParts[i]];
        
            if(++i < pParts.length)
                subMemory = this.getSubMemory(pParts, i, subMemory);
                
            return subMemory;
        }
    },
    
    getOrCreateSubMemory: function(pParts, i, subMemory) {
        if(subMemory === undefined) subMemory = Memory;
        if(i === undefined) i = 0;
        
        if(subMemory[pParts[i]] === undefined) {
            subMemory[pParts[i]] = {};
    
        subMemory = subMemory[pParts[i]];
    
        if(++i < pParts.length)
            subMemory = this.getOrCreateSubMemory(pParts, i, subMemory);
            
        return subMemory;
    },
    
    /** Registers a new path as alias if not already active
     * @param {string} new - The new Memory path
     * @param {string} old - The old Memory path
     * @return {boolean} registered
     */
    registerAlias: function(new, old) {
        var aliasArray = this.getAliasArray(old);
        
        if(aliasArray === undefined) {
            aliasArray = [old];
            this.getAliasTable()[this.getAliasTable().length] = aliasArray;
        }
        
        if(!checkIfPathActive(new)) {
            aliasArray[aliasArray.length] = new;
            return true;
            
            this._moveMemoryToAlias(new);
        }
        
        return false;
    },
    
    _moveSingleToAlias: function(pathMemory, pathSingle) {
        var pParts = this.getPathParts(pathMemory);
        var pSParts = this.getPathParts(pathSingle);
        
        var memory = this.getSubMemory(pParts);
        var single = this.getSubMemory(pSParts);
        
        memory[ pSParts[pSParts.length - 1] ] = single;
    },
    
    /** Moves one or multiple memory objects to the new path
     * @param {string} path - New memory path.
     * @return {boolean} success
     */
    _moveMemoryToAlias: function(path) {
        var pParts = this.getPathParts(path);
        if( _.contains(pParts, function(part) { return part.includes('.'); }) )
            return false;
        
        var activeAliasArray = this.getActiveAliasArray(path);
        var result = true;
        
        if(activeAliasArray.length > 1) {
            for(var i in activeAliasArray) {
                var oldPParts = this.getPathParts(activeAliasArray[i]);
                var result = this._copyKeys(pParts, oldPParts);
                if(!result) return result;
            }
        } else {
            var oldPParts = this.getPathParts(activeAliasArray[0]);
                
            result = this._copyKeys(pParts, oldPParts);
            
        }
        return result;
    },
    
    _copyKeys: function(pPartsTarget, pPartsSource) {
        var source = this.getSubMemory(pPartsSource);
        var target = this.getOrCreateSubMemory(pPartsTarget);
        
        if(source === undefined)
                return false;
                
        if(_.isObject(source) && !(_.isArray(source)) && !(_.isNumber(source)) && !(_.isString(source))) {
            var srcKeys = _.keys(source)
            for(var i in srcKeys)
                target[srcKeys[i]] = source[srcKeys[i]];
            
        } else {
            // oldSubMemory is not a path but a single key
            target[ pParts[(pParts.length - 1)] ] = source;
        }
    }
    
    /** Get all alias in an array
     * @param {string} path
     * @return {Array} aliasArray
     */
    getAliasArray: function(path) {
        var aliasTable = this.getAliasTable();
        for(var i in aliasTable {
            var aliasRow = aliasTable[i];
            if(_.contains(aliasRow, old))
                return aliasRow;
        }
        return undefined;
    },
    
    /** Returns all active alias paths
     * @param {string} path
     * @return {Array} activeAlias
     */
    getActiveAliasArray: function(path) {
        var aliasArray = this.getAliasArray(path);
        aliasArray = _.filter(aliasArray, function(curr) { return checkIfPathActive(curr); });
        return aliasArray;
    },
    
    /** Checks if memory path is active
     * @param {string} path
     * @return {boolean} active
     */
    checkIfPathActive: function(path) {
        var pParts = getPathParts(path);
        
        if(getSubMemory(pParts) !== undefined) {
            return true;
        } else {
            return false;
        }
    },
    
    /** Returns path as Array
     * @param {string} path
     * @return {Array} path
     */
    getPathParts: function(path) {
        return _.words(path, /[^.]+/g)
    },
    
    getAliasTable: function() {
        if(this.memory.aliasTable === undfined)
            this.memory.aliasTable = [];
        
        return this.memory.aliasTable;
    },
    
    memory: function() {
        if(Memory.util === undefined)
            Memory.util = {};
        if(Memory.util.memory === undefined)
            Memory.util.memory = {};
        
        return Memory.util.memory;
    }();
    
};