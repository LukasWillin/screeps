
const _ = require('lodash');
const IInstructionFunction = require('./activity.instruction.IInstructionFunction');

const setProto = Object.setPrototypeOf;
const getProto = Object.getPrototypeOf;

/**
 * General implementation to create Instruction functions.
 * It can either be extended and override abstract exec (multi use & redistribution) or directly
 * pass the concrete exec implementation (one time use).
 * 
 * This allows for instruction function to be either used just once or
 * create implementations which can be redistributed and reused.
 * @abstract
 * @implements {IInstructionFunction}
 * 
 * @example
 * // Single use instanciation :
 *  const singleInstrFn = new AInstructionFunction(function (ths, scope, cache, call, err, ...args) {
 *      console.log('Do whatever you only need once.');
 *  });
 * // or when youwant to reuse it
 *  class MultiInstructionFunction extends AInstructionFunction {
 *      exec (ths, scope, cache, call, err, ...args) {
 *          console.log('Do whatever else you might need multiple times.');
 *      }
 *  }
 *  const multiInstructionFunction = new MultiInstructionFunction();
 */
class AInstructionFunction extends Function {
    
    /**
     * @param {Function} [fn] - Optional concrete implementation of exec for one time usage.
     */
    constructor(fn) {
        const instrFn = function (ths, scope, cache, call, err, ...args) {
            return instrFn.exec(ths, scope, cache, call, err, ...args);
        };

        if (_.isFunction(fn)) {
            setProto(instrFn, {
                ...getProto(this),
                exec: fn
            });
        } else {
            setProto(instrFn, getProto(this));
        }

        return instrFn;
    }

    exec(ths, scope, cache, call, err, ...args) {
        throw new NotImplementedError(Error('Abstract implementation of AInstructionFunction#exec.'));
    }
}

module.exports = AInstructionFunction;