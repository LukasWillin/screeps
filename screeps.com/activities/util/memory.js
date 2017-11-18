
var MemoryUtil = {

    getMemory: function(identifier, config) {
      if(!identifier)
        throw {name: "MissingParamError", message: "an identifier must always be defined"};
      var path = "";
      if(config['package']) path = path.concat(".", config['package']);
      if(config['standard']) path = path.concat(".", config['standard']);
      if(config['custom']) path = path.concat(".", config['custom']);
      path = path.concat(".", identifier);

      this._getMemoryByPath(path, config['alias']);
    },

    /** @private
     * Get memory by path. If the alias provided exists the memory is first moved to
     * the memory path.
     * @param {string} path
     * @param {string} alias - Set if the memory path was different before. @optional
     *
     * @return {Object} - The requested memory object.
     */
    _getMemoryByPath: function(path, alias) {
        var subMemory
        if(alias !== undefined && alias !== null) {
          var aliasParts = _getPathParts(alias);
          subMemory = _getSubMemory(aliasParts);
        }


        var pathArray = this._getPathParts(path);

        subMemory = this._getOrCreateSubMemory(pathArray);

        return subMemory;
    },

    /** Returns the subMemory object for a pathArray or undefined if it doesnt exist
     * @param {Array} pathArray - Path as Array. To call this function only pass the pathArray as Argument.
     * @param {number} i - Current Iteration. (Passed on recursion)  @optional
     * @param {Object} subMemory - Current sub memory. (Passed on recursion) @optional
     *
     * @return {Object} The sub memory or undefined if it doesnt exist.
     */
    _getSubMemory: function(pathArray, subMemory, i){
        // Initialize recursion
        if(subMemory === undefined || subMemory === null) subMemory = Memory;
        if(i === undefined) i = 0;

        if(subMemory[pathArray[i]] === undefined) {
            return undefined;
        } else {
            subMemory = subMemory[pathArray[i]];

            if(++i < pathArray.length)
                subMemory = this._getSubMemory(pathArray, subMemory, i);

            return subMemory;
        }
    },

    /** Returns the subMemory object for a pathArray or creates&returns it if it doesnt exist
     * @param {Array} pathArray - Path as Array. To call this function only pass the pathArray as Argument.
     * @param {number} i - Current Iteration. (Passed on recursion)  @optional
     * @param {Object} subMemory - Current sub memory. (Passed on recursion) @optional
     *
     * @return {Object} The sub memory or undefined if it doesnt exist.
     */
    _getOrCreateSubMemory: function(pathArray, subMemory, i) {
        // Initialize recursion
        if(subMemory === undefined || subMemory === null) subMemory = Memory;
        if(i === undefined) i = 0;

        // Create subMemory if it doesnt exist
        if(subMemory[pathArray[i]] === undefined) {
            subMemory[pathArray[i]] = {};

        subMemory = subMemory[pathArray[i]];

        if(++i < pathArray.length)
            subMemory = this._getOrCreateSubMemory(pathArray, subMemory, i);

        return subMemory;
    },

    /** Registers a new path as alias if not already active
     * @param {string} new - The new Memory path
     * @param {string} old - The old Memory path
     * @return {boolean} - registered
     */
    _registerAlias: function(new, old) {
        var aliasArray = this._getAliasArray(old);

        if(aliasArray === undefined) {
            aliasArray = [old];
            _aliasTable[this.aliasTable().length] = aliasArray;
        }

        if(!_checkIfPathActive(new)) {
            aliasArray[aliasArray.length] = new;
            return true;

            this._moveMemoryToAlias(new);
        }

        return false;
    },

    _moveSingleToAlias: function(pathMemory, pathSingle) {
        var pathArray = this._getPathParts(pathMemory);
        var pSParts = this._getPathParts(pathSingle);

        var subMem = this._getSubMemory(pathArray);
        var single = this._getSubMemory(pSParts);

        subMem[ pSParts[pSParts.length - 1] ] = single;
    },

    /** Moves one or multiple memory objects to the new path
     * @param {string} path - New memory path.
     * @return {boolean} - Success
     */
    _moveMemoryToAlias: function(path) {
        var pathArray = this._getPathParts(path);
        if( _.contains(pathArray, function(part) { return part.includes('.'); }) )
            return false;

        var activeAliasArray = this._getActiveAliasArray(path);
        var result = true;

        if(activeAliasArray.length > 1) {
            for(var i in activeAliasArray) {
                var oldPParts = this._getPathParts(activeAliasArray[i]);
                var result = this._copyKeys(pathArray, oldPParts);
                if(!result) return result;
            }
        } else {
            var oldPParts = this._getPathParts(activeAliasArray[0]);

            result = this._copyKeys(pathArray, oldPParts);

        }
        return result;
    },

    _copyKeys: function(pPartsTarget, pPartsSource) {
        var source = this._getSubMemory(pPartsSource);
        var target = this._getOrCreateSubMemory(pPartsTarget);

        if(source === undefined)
                return false;

        if(_.isObject(source) && !(_.isArray(source)) && !(_.isNumber(source)) && !(_.isString(source))) {
            var srcKeys = _.keys(source)
            for(var i in srcKeys)
                target[srcKeys[i]] = source[srcKeys[i]];

        } else {
            // oldSubMemory is not a path but a single key
            target[ pathArray[(pathArray.length - 1)] ] = source;
        }
    },

    /** Get all alias in an array
     * @param {string} path
     * @return {Array}
     */
    _getAliasArray: function(path) {
        for(var i in this._aliasTable {
            var aliasRow = this._aliasTable[i];
            if(_.contains(aliasRow, old))
                return aliasRow;
        }
        return undefined;
    },

    /** Returns all active alias paths
     * @param {string} path
     * @return {Array}
     */
    _getActiveAliasArray: function(path) {
        var aliasArray = this._getAliasArray(path);
        aliasArray = _.filter(aliasArray, function(curr) { return _checkIfPathActive(curr); });
        return aliasArray;
    },

    /** Checks if memory path is active
     * @param {string} path
     * @return {boolean}
     */
    _checkIfPathActive: function(path) {
        var pathArray = _getPathParts(path);

        if(_getSubMemory(pathArray) !== undefined) {
            return true;
        } else {
            return false;
        }
    },

    /** Returns path as Array
     * @param {string} path
     * @return {Array}
     */
    _getPathParts: function(path) {
        return _.words(path, /[^.]+/g)
    },

    _mem: (function() {
        this.getMemory('MemoryUtil', {package = this.PACKAGE.UTIL));
    })(),

    _aliasTable: (function() {
        if(this._mem.aliasTable === undfined
            || this._mem.aliasTable === null) {
            this._mem.aliasTable = [];
        }

        return this._mem.aliasTable;
    })(),

    PACKAGE: {
      ACTIVITY: "activity",
      EVENT: "event",
      OBJECT: "object",
      UTIL: "util",
      RESOURCE: "resource",
      GAME: "game"
    },

    STANDARDS: {
      SYSTEM: "system",
      CREEP: "creeps",
      STRUCTURE: "structures",
      SOURCE: "sources"
    }

};

module.exports = MemoryUtil;
