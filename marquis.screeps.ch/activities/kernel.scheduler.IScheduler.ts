
// import { Dictionary } from "lodash";

// /**
//  * @name IScheduler
//  * @interface
//  */
interface IScheduler
{
    // /**
    //  * Called by kernel.
    //  * @param {float} cpuBudget - A cpu budget.
    //  * @param {Function} callFactory - Factory creating an activity aware call function.
    //  */
    // init(cpuBudget: number, callFactory: Function): void;

    // register(activityInstance: IActivityEntity): void;

    // _schedule(): void;

    // /**
    //  * 
    //  * @param {int} cpuBudget 
    //  * @param {Function} callFactory - Creates an activity aware call function.
    //  */
    // _tick(cpuBudget: number, callFactory: Function): void;

    // _activityList(): Array<IActivityEntity>;

    // /**
    //  * The activity classes are all the available classes required to execute an activity.
    //  * The activity json object specifies the name of the class which will execute it.
    //  * @param {Object} activityClasses - An object containing classes by class name.
    //  * 
    //  * @example
    //  *  {
    //  *      'name': class BuilderActivity { }
    //  *  }
    //  */
    // activityClassHashMap: Dictionary<IActivity>;
};

// --- How to create instructions (parted functions)

// /**
//  * Instruction
//  * @type {Array<InstructionFunction>}
//  * 
//  */
// const Instruction = [
//     function instrFn0(scope, call, err, ...args)
//     {
//         scope.anArg = args[0];
//     },
//     function instrFn1(scope, call, err, ...args)
//     {
//         if(err) return err;

//         scope.out = 1234;
//         return true;
//     }
// ];

// /**
//  * A function which takes a this-argument and a scope to operate
//  * and returns only with a value when it has calculated one otherwise 
//  * all data must be stored within the scope.
//  * The scope is store in memory so dont overuse it! Only store the most relevant data in it.
//  * 
//  * @example 
//  * // Instruction function (with args)
//  * [
//  *  function (ths, scope, call, err, ...args) {
//  *      scope.id = 1234;
//  *      call(ths, ths.someOtherInstructionSet, args); // Call another instruction set whos result is passed as an argument to instruction #1 if set true.
//  *  },
//  *  function endInstrFn(ths, scope, call, err, ...args) {
//  *      return args[0];
//  *  }
//  * ]
//  */
// class InstructionFunction extends Function { }

export default IScheduler