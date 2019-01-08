
const _ = require('lodash');

const setProto = Object.setPrototypeOf;
const getProto = Object.getPrototypeOf;

class InstructionFunction extends Function {
    constructor(fn) {
        if (_.isFunction(fn)) {
            const instrFn = function (ths, scope, cache, call, err, ...args) {
                return instrFn.exec(ths, scope, cache, call, err, ...args);
            };
            setProto(instrFn, {
                ...getProto(InstructionFunction),
                exec: fn
            });
            return instrFn;
        }
    }

    exec(ths, scope, cache, call, err, ...args) {
        throw new NotImplementedError(Error('InstructionFunction#exec is not implemented.'));
    }
}

module.exports = InstructionFunction;

new InstructionFunction(function () { console.log('Doing Stuff'); });

class SomeInstructionFunction extends InstructionFunction {
    exec() {
        console.log('Doing other stuff');
    }
}
new SomeInstructionFunction();