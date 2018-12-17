
const NotImplementedError = require('/errors/NotImplementedError');

class IScheduler {
    constructor(activityList) { }

    schedule() {
        throw new NotImplementedError("Interface implementation of IScheduler#schedule");
    }
}

// class IActivityScheduler {

// 	static run() {
//         throw new NotImplementedError('Static method #run of IActivityScheduler must be overridden.');
// 	}

// 	static register( activityID ) {
//         throw new NotImplementedError('Static method #register of IActivityScheduler must be overridden.');
// 	}

// 	static _schedule() {
//         throw new NotImplementedError('Static method #_schedule of IActivityScheduler must be overridden.');
// 	}

// 	static _execute( cycleCpuLimit ) {
//         throw new NotImplementedError('Static method #_execute of IActivityScheduler must be overridden.');
//     }

// 	static get _activityList () {
//         throw new NotImplementedError('Static member #_activityList of IActivityScheduler must be overridden.');
// 	}

//     static addActivityClass(activityClass) {
//         throw new NotImplementedError('Static method #addActivityClass of IActivityScheduler must be overridden');
//     }
// };
// IActivityScheduler.className = 'IActivityScheduler';
// IActivityScheduler.memory = null;


module.exports = IScheduler;
