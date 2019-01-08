
const ActivitySystem = {
    invoke: function() { }, // TODO: Invoke the kernel

    Scheduler: require('./kernel.scheduler.SimpleScheduler'),
    Kernel: require('./kernel.IKernel'), // TODO:

    package: {
        activity: {
            IActivity: require('./activity.IActivity'),
            AActivity: require('./activity.AActivity'),
            instruction: {
                IInstructionSet: require('./activity.instruction.IInstructionSet'),
                IInstruction: require('./activity.instruction.IInstruction'),
                IInstructionFunction: require('./activity.instruction.IInstructionFunction')
            }
        },
        kernel: {
            IKernel: require('./kernel.IKernel'),
            IActivityEntity: require('./kernel.IActivityEntity'),
            IActivityExecutionStack: require('./kernel.IActivityExecutionStack'),
            IActivityExecutionState: require('./kernel.IActivityExecutionState'),
            scheduler: {
                IScheduler: require('./kernel.scheduler.IScheduler'),
                AScheduler: require('./kernel.scheduler.IScheduler'), // TODO:
                SimpleScheduler: require('./kernel.scheduler.SimpleScheduler')
            }
        },
        errors: {
            IllegalArgumentError: require('./errors.IllegalArgumentError'),
            NotImplementedError: require('./errors.NotImplementedError'),
            MissinArgumentError: require('./errors.MissingArgumentError'),
            InternalStateError: require('./errors.InternalStateError')
        }
    }
}

module.exports = ActivitySystem;