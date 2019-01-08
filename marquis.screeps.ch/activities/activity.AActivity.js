const IActivity = require('./activity.IActivity');

/**
 * @implements {IActivity}
 */
class AActivity {
    
}

Object.defineProperties(AActivity.prototype, {
    run: { 
        value: [
            function instr0(ths, scope, call, err, ...args) { 
                throw new NotImplementedError("Abstract implementation of AActivity#run");
            }
        ] 
    }
});

module.exports = AActivity;
