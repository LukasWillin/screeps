/* eslint-disable no-inner-declarations */
/* eslint-disable no-unused-vars */

const isFunction = (function() 
{
    /**
     * Lodash (Custom Build) <https://lodash.com/>
     * Build: `lodash modularize exports="npm" -o ./`
     * Copyright JS Foundation and other contributors <https://js.foundation/>
     * Released under MIT license <https://lodash.com/license>
     * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
     * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
     */
    var asyncTag = '[object AsyncFunction]',
        funcTag = '[object Function]',
        genTag = '[object GeneratorFunction]',
        nullTag = '[object Null]',
        proxyTag = '[object Proxy]',
        undefinedTag = '[object Undefined]';
    var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;
    var freeSelf = typeof self == 'object' && self && self.Object === Object && self;
    var root = freeGlobal || freeSelf || Function('return this')();
    var objectProto = Object.prototype;
    var hasOwnProperty = objectProto.hasOwnProperty;
    var nativeObjectToString = objectProto.toString;
    var Symbol = root.Symbol, symToStringTag = Symbol ? Symbol.toStringTag : undefined;
    function baseGetTag(value) 
    {
        if(value == null) 

            return value === undefined ? undefinedTag : nullTag;
        
        return(symToStringTag && symToStringTag in Object(value))
            ? getRawTag(value)
            : objectToString(value);
    }
    function getRawTag(value) 
    {
        var isOwn = hasOwnProperty.call(value, symToStringTag),
            tag = value[symToStringTag];

        try
        {
            value[symToStringTag] = undefined;
            var unmasked = true;
        }
        catch(e) { }

        var result = nativeObjectToString.call(value);
        if(unmasked) 

            if(isOwn) 
            {
                value[symToStringTag] = tag;
            }
            else
            {
                delete value[symToStringTag];
            }
        
        return result;
    }
    function objectToString(value) 
    {
        return nativeObjectToString.call(value);
    }
    function __isFunction(value) 
    {
        if(!__isObject(value)) 

            return false;
        
        // The use of `Object#toString` avoids issues with the `typeof` operator
        // in Safari 9 which returns 'object' for typed arrays and other constructors.
        var tag = baseGetTag(value);
        return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
    }
    function __isObject(value) 
    {
        var type = typeof value;
        return value != null && (type == 'object' || type == 'function');
    }
    return __isFunction;
})();

const isString = (function() 
{
    /**
     * lodash 4.0.1 (Custom Build) <https://lodash.com/>
     * Build: `lodash modularize exports="npm" -o ./`
     * Copyright 2012-2016 The Dojo Foundation <http://dojofoundation.org/>
     * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
     * Copyright 2009-2016 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
     * Available under MIT license <https://lodash.com/license>
     */
    var stringTag = '[object String]';
    var objectProto = Object.prototype;
    var objectToString = objectProto.toString;
    var isArray = Array.isArray;
    function isObjectLike(value) 
    {
        return!!value && typeof value == 'object';
    }
    function __isString(value) 
    {
        return typeof value == 'string' ||
            (!isArray(value) && isObjectLike(value) && objectToString.call(value) == stringTag);
    }
    return __isString;
})();

module.exports = function factory(options, indexModuleName, indexModuleFactory) 
{

    if(arguments.length === 1) 
    {
        indexModuleFactory = options;
        options = {};
        indexModuleName = '';
    }
    else if(arguments.length === 2) 
    {
        indexModuleFactory = indexModuleName;
        indexModuleName = '';
    }

    if(!options.toNodeModule) 
    {
        options.toNodeModule = true;
        const factoryArgs = [null, options, indexModuleName, indexModuleFactory];
        let _factory = factory.bind.apply(factory, factoryArgs);
        function reroot(remain) 
        {
            options.parentRemain = remain;
            return _factory.call();
        }
        reroot.name = 'reroot';
        return reroot;
    }

    // Remain Factory
    const mainRequire = require.bind(require.main);

    class MainModulePathError extends Error 
    {
        constructor(message) 
        {
            super(message);
            this.name = 'MainModulePathError';
        }
    }

    let _rootPath = '';
    let _indexRequire = null;
    let _parentRemain = null;
    let _indexModuleName = '';
    let _indexModuleFactory = null;
    let _indexModule = null;
    let _remain_modules = {};

    /**
     * Shortcut and sanitizer to call require.main.require as a resolver of "absolute" paths
     * based on the index folder.
     * @param {string} modulePath - A static module path based on the index folder.
     *      Can either be "/package/path/to/file"
     *          or "./package/path/to/file"
     *          or "package/path/to/file"
     * @returns {any} The resolved file.
     */
    function remain(modulePath) 
    {
        // Sanitize module paths.
        if(remain.rootPath !== undefined) 

            modulePath = remain.rootPath + modulePath;
        
        if(modulePath.startsWith('/')) 

            modulePath = '.' + modulePath;
        

        if(!modulePath.startsWith('.')) 

            if(remain.parentRemain) 
            {
                return remain.parentRemain(modulePath);
            }
            else
            {
                // TODO: Check if entry exists or else throw error
                return _remain_modules[modulePath];
            }
        

        /* Require the module
         * Check if the module is already rerooted.
         * If not call the reroot function and pass configured remain function. */
        const reroot = remain.require(modulePath);

        if(isFunction(reroot) && reroot.name === 'reroot') 
        {
            if(!reroot._rooted) 
            {
                reroot._exports = reroot(remain);
                reroot._rooted = true;
            }
            return reroot._exports;
        }
        return reroot;
    }

    Object.defineProperties(remain, {
        rootPath: {
            get: function() 
            {
                return _rootPath;
            }
        },
        require: {
            get: function() 
            {
                return(_indexRequire) ? _indexRequire : mainRequire;
            }
        },
        indexModule: {
            get: function() 
            {
                return _indexModule;
            }
        },
        parentRemain: {
            get: function() 
            {
                return _parentRemain;
            }
        },
        indexName: {
            get: function() 
            {
                return _indexName;
            }
        },
        register: {
            value: function(name, indexModule) 
            {
                // if (isString(indexModule)) indexModule = remain(indexModule);
                if(name === '') return;
                
                if(remain.parentRemain !== null) 

                    remain.parentRemain.register(name, indexModule);
                
                else
                // TODO: RemainModule passed
                    _remain_modules[name] = indexModule;
                
            }
        },
        name: {
            get: function() 
            {
                return'remain';
            }
        }
    });

    // Set options
    if(options.parentRemain) _parentRemain = options.parentRemain;

    _indexModuleName = indexModuleName;
    _indexModuleFactory = indexModuleFactory;
    if(options.rootPath) _rootPath = options.rootPath;
    if(options.indexRequire) _indexRequire = options.indexRequire;

    _indexModule = indexModuleFactory(remain);
    remain.register(_indexModuleName, _indexModule);

    return _indexModule;
};